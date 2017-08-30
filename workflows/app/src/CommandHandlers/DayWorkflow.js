module.exports = function(eventRepository, logger, Day, Client) {
  return function DayWorkflow() {
    async function scheduleAppointment(cmd, continuationId) {
      let day = await scheduleAppointmentBase(cmd);
      let newAppointmentId = day.getNewAppointmentId(cmd.startTime, cmd.endTime, cmd.trainerId);

      logger.info('saving Day');
      logger.trace(day._id);

      await eventRepository.save(day, { continuationId });
      return { appointmentId: newAppointmentId };
    }

    async function updateAppointment(cmd, continuationId) {
      logger.info(`calling updateAppointment on Day`);
      let day = await eventRepository.getById(Day, cmd.entityName);
      day.updateAppointment(cmd);

      logger.info('saving Day');
      logger.trace(day._id);

      await eventRepository.save(day, { continuationId });
      return { appointmentId: cmd.appointmentId };
    }

    async function removeAppointmentFromPast(cmd, continuationId) {
      logger.info(`calling ${cmd.commandName} on Day`);
      let day = await eventRepository.getById(Day, cmd.entityName);
      day.removeAppointmentFromPast(cmd);

      logger.info('saving Day');
      logger.trace(day._id);

      await eventRepository.save(day, { continuationId });
      return { appointmentId: cmd.appointmentId };
    }

    async function cancelAppointment(cmd, continuationId) {
      logger.info(`calling ${cmd.commandName} on Day`);
      let day = await eventRepository.getById(Day, cmd.entityName);
      day.cancelAppointment(cmd);

      logger.info('saving Day');
      logger.trace(day._id);

      await eventRepository.save(day, { continuationId });
      return { appointmentId: cmd.appointmentId };
    }

    async function rescheduleAppointment(cmd, continuationId) {
      if (cmd.originalEntityName !== cmd.entityName) {
        return rescheduleAppointmentToNewDay(cmd, continuationId);
      }
      return await updateAppointment(cmd, continuationId);
    }

    async function rescheduleAppointmentFromPast(cmd, continuationId) {
      if (cmd.originalEntityName !== cmd.entityName) {
        return rescheduleAppointmentFromPastToNewDay(cmd, continuationId);
      }
      return await updateAppointmentFromPast(cmd, continuationId);
    }

    async function rescheduleAppointmentToNewDay(cmd, continuationId) {
      cmd.commandName = 'rescheduleAppointmentToNewDay';
      let day = await scheduleAppointmentBase(cmd);
      let oldDay = await eventRepository.getById(Day, cmd.originalEntityName);
      oldDay.cancelAppointment(cmd);
      let newAppointmentId = day.getNewAppointmentId(cmd.startTime, cmd.endTime, cmd.trainerId);

      logger.info('saving Day');
      await eventRepository.save(day, { continuationId });

      logger.info('saving OldDay');
      logger.trace(oldDay._id);
      await eventRepository.save(oldDay, { continuationId });

      return {
        updateType: 'rescheduleAppointmentToNewDay',
        oldAppointmentId: cmd.appointmentId,
        newAppointmentId
      };
    }

    async function rescheduleAppointmentFromPastToNewDay(cmd, continuationId) {
      cmd.commandName = 'rescheduleAppointmentFromPastToNewDay';
      let day = await scheduleAppointmentBase(cmd);
      let oldDay = await eventRepository.getById(Day, cmd.originalEntityName);
      const origAppointment = Object.assign({}, oldDay.getAppointment(cmd.appointmentId));
      oldDay.removeAppointmentFromPast(cmd);
      let newAppointmentId = day.getNewAppointmentId(cmd.startTime, cmd.endTime, cmd.trainerId);

      if (!await handleUpdateOfClientsFromPast(cmd, origAppointment, continuationId)
        && !await handleUpdateOfappointmentTypeFromPast(cmd, continuationId)) {
        const newCmd = Object.assign({}, cmd, {appointment: newAppointmentId});
        for (let x in newCmd.clients) {
          let client = await eventRepository.getById(Client, x);
          logger.debug('associating client with updated appointment from past');
          client.clientAttendsAppointment(newCmd);

          logger.info('saving client');
          logger.trace(client);
          await eventRepository.save(client, {continuationId});
        }
      }

      logger.info('saving Day');
      await eventRepository.save(day, { continuationId });

      logger.info('saving OldDay');
      logger.trace(oldDay._id);
      await eventRepository.save(oldDay, { continuationId });

      return {
        updateType: 'rescheduleAppointmentToNewDay',
        oldAppointmentId: cmd.appointmentId,
        newAppointmentId
      };
    }

    async function handleUpdateOfClientsFromPast(cmd, origAppointment, continuationId) {
      if (cmd.changes.clients) {
        // if a client is no longer on the appointment refund the session
        for (let clientId of origAppointment.clients.filter(x => !cmd.clients.find(y => y === x))) {
          let client = await eventRepository.getById(Client, clientId);
          logger.debug('returning session to client');
          client.returnSessionFromPast(cmd.appointmentId);
          logger.info('saving client');
          logger.trace(client);

          await eventRepository.save(client, {continuationId});
        }
        // if a new client is on appointment associate a session with them
        for (let clientId of cmd.clients.filter(x => !origAppointment.clients.find(y => y === x))) {
          let client = await eventRepository.getById(Client, clientId);
          logger.debug('associating new client with updated appointment from past');
          client.clientAttendsAppointment(cmd);
          logger.info('saving client');
          logger.trace(client);

          await eventRepository.save(client, {continuationId});
        }
      }
      return cmd.changes.clients;
    }

    async function handleUpdateOfappointmentTypeFromPast(cmd, continuationId) {
      // if type changes to or from pair it will be handled above
      // else it is a single so refund then re associate
      if (cmd.changes.appointmentType) {
        let client = await eventRepository.getById(Client, cmd.clients[0]);
        logger.debug('returning session to client');
        client.returnSessionFromPast(cmd.appointmentId);
        logger.debug('associating client with new appointment type');
        client.clientAttendsAppointment(cmd);

        logger.info('saving client');
        logger.trace(client);
        await eventRepository.save(client, {continuationId});
      }
      return cmd.changes.appointmentType;
    }

    async function updateAppointmentFromPast(cmd, continuationId) {
      logger.info(`calling updateAppointmentFromPast on Day`);
      let day = await eventRepository.getById(Day, cmd.entityName);
      const origAppointment = day.getAppointment(cmd.appointmentId);

      if (!await handleUpdateOfClientsFromPast(cmd, origAppointment, continuationId)) {
        await handleUpdateOfappointmentTypeFromPast(cmd, continuationId);
      }

      day.updateAppointment(cmd);
      logger.info('saving Day');
      logger.trace(day._id);

      await eventRepository.save(day, {continuationId});
      return {appointmentId: cmd.appointmentId};
    }

    async function scheduleAppointmentBase(cmd) {
      logger.info(`calling ${cmd.commandName} on Day`);
      let day = await eventRepository.getById(Day, cmd.entityName);
      if (!day) {
        day = new Day();
      }
      day.scheduleAppointment(cmd);
      return day;
    }

    return {
      handlerName: 'DayWorkflow',
      scheduleAppointment,
      rescheduleAppointment,
      cancelAppointment,
      updateAppointment,
      removeAppointmentFromPast,
      rescheduleAppointmentFromPast,
      updateAppointmentFromPast
    };
  };
};
