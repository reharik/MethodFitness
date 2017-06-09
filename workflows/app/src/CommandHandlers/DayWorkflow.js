module.exports = function(eventRepository, logger, Day) {
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
      if (!day) {
        day = new Day();
      }
      day.updateAppointment(cmd);

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

    async function rescheduleAppointmentToNewDay(cmd, continuationId) {
      let day = await scheduleAppointmentBase(cmd);
      let oldDay = await eventRepository.getById(Day, cmd.originalEntityName);
      oldDay.cancelAppointment(cmd);
      let newAppointmentId = day.getNewAppointmentId(cmd.startTime, cmd.endTime, cmd.trainerId);

      logger.info('saving Day');
      logger.trace(day._id);
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
      updateAppointment
    };
  };
};
