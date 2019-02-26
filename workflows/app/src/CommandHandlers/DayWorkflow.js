module.exports = function(
  eventRepository,
  changeAppointmentFromPast,
  logger,
  day,
  trainer,
  client,
  location,
  metaLogger,
) {
  return function DayWorkflow() {
    const enrichCmd = async cmd => {
      let cmdClone = Object.assign({}, cmd);
      const trainerInstance = await eventRepository.getById(
        trainer,
        cmdClone.trainerId,
      );
      const locationInstance = await eventRepository.getById(
        location,
        cmdClone.locationId,
      );
      let clientInstances = [];
      for (let clientId of cmdClone.clients) {
        clientInstances.push(await eventRepository.getById(client, clientId));
      }
      cmdClone.locationName = locationInstance.name;
      cmdClone.trainerFirstName = trainerInstance.contact.firstName;
      cmdClone.trainerLastName = trainerInstance.contact.lastName;
      cmdClone.clients = clientInstances.map(x => ({
        firstName: x.contact.firstName,
        lastName: x.contact.lastName,
        clientId: x.clientId,
      }));
      return cmdClone;
    };

    async function scheduleAppointment(cmd, continuationId) {
      let dayInstance = await scheduleAppointmentBase(cmd);
      let newAppointmentId = dayInstance.getNewAppointmentId(
        cmd.startTime,
        cmd.endTime,
        cmd.trainerId,
      );

      logger.info('saving dayInstance');
      logger.trace(dayInstance.state._id);
      await eventRepository.save(dayInstance, { continuationId });
      return { appointmentId: newAppointmentId };
    }

    async function updateAppointment(cmd, continuationId) {
      const cmdClone = enrichCmd(cmd);
      let dayInstance = await eventRepository.getById(day, cmdClone.entityName);
      await dayInstance.updateAppointment(cmdClone);

      logger.info('saving dayInstance');
      logger.trace(dayInstance.state._id);

      await eventRepository.save(dayInstance, { continuationId });
      return { appointmentId: cmdClone.appointmentId };
    }

    async function cancelAppointment(cmd, continuationId) {
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

    async function rescheduleAppointmentToNewDay(cmd, continuationId) {
      let dayInstance = await scheduleAppointmentBase(cmd);
      let oldDay = await eventRepository.getById(day, cmd.originalEntityName);
      oldDay.cancelAppointment(cmd);
      let newAppointmentId = dayInstance.getNewAppointmentId(
        cmd.startTime,
        cmd.endTime,
        cmd.trainerId,
      );

      logger.info('saving dayInstance');
      await eventRepository.save(dayInstance, { continuationId });

      logger.info('saving OldDay');
      logger.trace(oldDay.state._id);
      await eventRepository.save(oldDay, { continuationId });

      return {
        updateType: 'rescheduleAppointmentToNewDay',
        oldAppointmentId: cmd.appointmentId,
        newAppointmentId,
      };
    }

    async function scheduleAppointmentBase(cmd) {
      const cmdClone = enrichCmd(cmd);
      let dayInstance =
        (await eventRepository.getById(day, cmdClone.entityName)) || day();
      await dayInstance.scheduleAppointment(
        cmdClone,
        trainerInstance,
        clientInstances,
        locationInstance,
      );
      return dayInstance;
    }

    async function scheduleAppointmentInPast(cmd, continuationId) {
      logger.info(`calling ${cmd.commandName} on Day`);
      const cmdClone = enrichCmd(cmd);
      let dayInstance =
        (await eventRepository.getById(day, cmdClone.entityName)) || day();
      await dayInstance.scheduleAppointmentInPast(cmdClone);
      let newAppointmentId = dayInstance.getNewAppointmentId(
        cmdClone.startTime,
        cmdClone.endTime,
        cmdClone.trainerId,
      );

      logger.info('saving dayInstance');
      logger.trace(dayInstance.state._id);
      await eventRepository.save(dayInstance, { continuationId });

      // this is ok because it's not updating existing info just adding it. ... I think
      // possible that eventhandlerbase not called on client because this is day, so that could be problem
      // but should still probably be moved to client
      const newCmd = Object.assign({}, cmdClone, {
        appointmentId: newAppointmentId,
      });
      for (let clientId of newCmd.clients) {
        let c = await eventRepository.getById(client, clientId);
        logger.debug('associating client with appointment from past');
        c.clientAttendsAppointment(newCmd);
        logger.info('saving client');
        await eventRepository.save(c, { continuationId });
      }
      return { appointmentId: newAppointmentId };
    }

    async function updateAppointmentFromPast(cmd, continuationId) {
      const cmdClone = enrichCmd(cmd);
      await changeAppointmentFromPast(cmdClone, continuationId);
      return {
        updateType:
          cmdClone.originalEntityName !== cmdClone.entityName
            ? 'rescheduleAppointmentToNewDay'
            : '',
        appointmentId: cmdClone.appointmentId,
      };
    }

    async function removeAppointmentFromPast(cmd, continuationId) {
      let dayInstance = await eventRepository.getById(day, cmd.entityName);
      dayInstance.removeAppointmentFromPast(cmd);

      logger.info('saving dayInstance');
      logger.trace(dayInstance.state._id);
      await eventRepository.save(dayInstance, { continuationId });

      return { appointmentId: cmd.appointmentId };
    }

    return metaLogger(
      {
        handlerName: 'DayWorkflow',
        scheduleAppointment,
        rescheduleAppointment,
        cancelAppointment,
        updateAppointment,
        scheduleAppointmentInPast,
        removeAppointmentFromPast,
        updateAppointmentFromPast,
      },
      'DayWorkflow',
    );
  };
};
