module.exports = function(eventRepository, changeAppointmentFromPast,
  logger,
  day,
  client,
  metaLogger) {
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
      let dayInstance = await eventRepository.getById(day, cmd.entityName);
      dayInstance.updateAppointment(cmd);

      logger.info('saving dayInstance');
      logger.trace(dayInstance.state._id);

      await eventRepository.save(dayInstance, { continuationId });
      return { appointmentId: cmd.appointmentId };
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

    async function scheduleAppointmentBase(cmd) {
      let dayInstance = await eventRepository.getById(day, cmd.entityName) || day();
      dayInstance.scheduleAppointment(cmd);
      return dayInstance;
    }

    async function scheduleAppointmentInPast(cmd, continuationId) {
      logger.info(`calling ${cmd.commandName} on Day`);
      let dayInstance = await eventRepository.getById(day, cmd.entityName) || day();
      dayInstance.scheduleAppointmentInPast(cmd);
      let newAppointmentId = dayInstance.getNewAppointmentId(cmd.startTime, cmd.endTime, cmd.trainerId);

      logger.info('saving dayInstance');
      logger.trace(dayInstance.state._id);
      await eventRepository.save(dayInstance, { continuationId });

      // this is ok because it's not updating existing info just adding it. ... I think
      // possible that eventhandlerbase not called on client because this is day, so that could be problem
      // but should still probably be moved to client
      const newCmd = Object.assign({}, cmd, { appointmentId: newAppointmentId } );
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
      await changeAppointmentFromPast(cmd, continuationId);
      return {
        updateType: cmd.originalEntityName !== cmd.entityName
          ? 'rescheduleAppointmentToNewDay'
          : '',
        appointmentId: cmd.appointmentId
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

    return metaLogger({
      handlerName: 'DayWorkflow',
      scheduleAppointment,
      rescheduleAppointment,
      cancelAppointment,
      updateAppointment,
      scheduleAppointmentInPast,
      removeAppointmentFromPast,
      updateAppointmentFromPast
    }, 'DayWorkflow');
  };
};

