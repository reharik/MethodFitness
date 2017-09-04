module.exports = function(eventRepository, logger, day, client) {
  return function DayWorkflow() {
    async function scheduleAppointment(cmd, continuationId) {
      let dayInstance = await scheduleAppointmentBase(cmd);
      let newAppointmentId = dayInstance.getNewAppointmentId(cmd.startTime, cmd.endTime, cmd.trainerId);

      logger.info('saving dayInstance');
      logger.trace(dayInstance.state._id);
      await eventRepository.save(dayInstance, { continuationId });
      return { appointmentId: newAppointmentId };
    }

    async function updateAppointment(cmd, continuationId) {
      logger.info(`calling updateAppointment on Day`);
      let dayInstance = await eventRepository.getById(day, cmd.entityName);
      dayInstance.updateAppointment(cmd);

      logger.info('saving dayInstance');
      logger.trace(dayInstance.state._id);

      await eventRepository.save(dayInstance, { continuationId });
      return { appointmentId: cmd.appointmentId };
    }

    async function removeAppointmentFromPast(cmd, continuationId) {
      logger.info(`calling ${cmd.commandName} on Day`);
      let dayInstance = await eventRepository.getById(day, cmd.entityName);
      dayInstance.removeAppointmentFromPast(cmd);

      logger.info('saving dayInstance');
      logger.trace(dayInstance.state._id);

      await eventRepository.save(dayInstance, { continuationId });
      return { appointmentId: cmd.appointmentId };
    }

    async function cancelAppointment(cmd, continuationId) {
      logger.info(`calling ${cmd.commandName} on Day`);
      let dayInstance = await eventRepository.getById(day, cmd.entityName);
      dayInstance.cancelAppointment(cmd);

      logger.info('saving dayInstance');
      logger.trace(dayInstance.state._id);

      await eventRepository.save(dayInstance, { continuationId });
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
      let dayInstance = await scheduleAppointmentBase(cmd);
      let oldDay = await eventRepository.getById(dayInstance, cmd.originalEntityName);
      oldDay.cancelAppointment(cmd);
      let newAppointmentId = dayInstance.getNewAppointmentId(cmd.startTime, cmd.endTime, cmd.trainerId);

      logger.info('saving dayInstance');
      await eventRepository.save(dayInstance, { continuationId });

      logger.info('saving OldDay');
      logger.trace(oldDay.state._id);
      await eventRepository.save(oldDay, { continuationId });

      return {
        updateType: 'rescheduleAppointmentToNewDay',
        oldAppointmentId: cmd.appointmentId,
        newAppointmentId
      };
    }

    async function rescheduleAppointmentFromPastToNewDay(cmd, continuationId) {
      cmd.commandName = 'rescheduleAppointmentFromPastToNewDay';
      let dayInstance = await scheduleAppointmentBase(cmd);
      let oldDay = await eventRepository.getById(dayInstance, cmd.originalEntityName);
      const origAppointment = Object.assign({}, oldDay.getAppointment(cmd.appointmentId));
      oldDay.removeAppointmentFromPast(cmd);
      let newAppointmentId = dayInstance.getNewAppointmentId(cmd.startTime, cmd.endTime, cmd.trainerId);

      if (!await handleUpdateOfClientsFromPast(cmd, origAppointment, continuationId)
        && !await handleUpdateOfappointmentTypeFromPast(cmd, continuationId)) {
        const newCmd = Object.assign({}, cmd, {appointment: newAppointmentId});
        for (let x in newCmd.clients) {
          let c = await eventRepository.getById(client, x);
          logger.debug('associating client with updated appointment from past');
          c.clientAttendsAppointment(newCmd);

          logger.info('saving client');
          logger.trace(c);
          await eventRepository.save(c, {continuationId});
        }
      }

      logger.info('saving dayInstance');
      await eventRepository.save(dayInstance, { continuationId });

      logger.info('saving OldDay');
      logger.trace(oldDay.state._id);
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
          let c = await eventRepository.getById(client, clientId);
          logger.debug('returning session to client');
          c.returnSessionFromPast(cmd.appointmentId);
          logger.info('saving client');
          logger.trace(c);

          await eventRepository.save(c, {continuationId});
        }
        // if a new client is on appointment associate a session with them
        for (let clientId of cmd.clients.filter(x => !origAppointment.clients.find(y => y === x))) {
          let c = await eventRepository.getById(client, clientId);
          logger.debug('associating new client with updated appointment from past');
          c.clientAttendsAppointment(cmd);
          logger.info('saving client');
          logger.trace(c);

          await eventRepository.save(c, {continuationId});
        }
      }
      return cmd.changes.clients;
    }

    async function handleUpdateOfappointmentTypeFromPast(cmd, continuationId) {
      // if type changes to or from pair it will be handled above
      // else it is a single so refund then re associate
      if (cmd.changes.appointmentType) {
        let clientInstance = await eventRepository.getById(client, cmd.clients[0]);
        logger.debug('returning session to clientInstance');
        clientInstance.returnSessionFromPast(cmd.appointmentId);
        logger.debug('associating clientInstance with new appointment type');
        clientInstance.clientAttendsAppointment(cmd);

        logger.info('saving clientInstance');
        logger.trace(clientInstance);
        await eventRepository.save(clientInstance, {continuationId});
      }
      return cmd.changes.appointmentType;
    }

    async function updateAppointmentFromPast(cmd, continuationId) {
      logger.info(`calling updateAppointmentFromPast on Day`);
      let dayInstance = await eventRepository.getById(day, cmd.entityName);
      const origAppointment = dayInstance.getAppointment(cmd.appointmentId);

      if (!await handleUpdateOfClientsFromPast(cmd, origAppointment, continuationId)) {
        await handleUpdateOfappointmentTypeFromPast(cmd, continuationId);
      }

      dayInstance.updateAppointment(cmd);
      logger.info('saving dayInstance');
      logger.trace(dayInstance.state._id);

      await eventRepository.save(dayInstance, {continuationId});
      return {appointmentId: cmd.appointmentId};
    }

    async function scheduleAppointmentBase(cmd) {
      logger.info(`calling ${cmd.commandName} on Day`);
      let dayInstance = await eventRepository.getById(day, cmd.entityName);
      if (!dayInstance) {
        dayInstance = day();
      }
      dayInstance.scheduleAppointment(cmd);
      return dayInstance;
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
