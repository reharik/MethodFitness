module.exports = function(
  eventRepository,
  logger,
  day,
  trainer,
  client,
  location,
  metaLogger,
) {
  return function DayWorkflow() {
    const getClientInstances = async cmd => {
      let clientInstances = [];
      for (let clientId of cmd.clients) {
        clientInstances.push(await eventRepository.getById(client, clientId));
      }
      return clientInstances;
    };

    const enrichCmd = async (cmd, clients) => {
      let cmdClone = Object.assign({}, cmd);
      const trainerInstance = await eventRepository.getById(
        trainer,
        cmdClone.trainerId,
      );
      const locationInstance = await eventRepository.getById(
        location,
        cmdClone.locationId,
      );
      const clientInstances = clients || (await getClientInstances(cmd));

      cmdClone.locationName = locationInstance.name;
      cmdClone.trainerFirstName = trainerInstance.state.firstName;
      cmdClone.trainerLastName = trainerInstance.state.lastName;
      cmdClone.clients = clientInstances.map(x => ({
        firstName: x.state.firstName,
        lastName: x.state.lastName,
        clientId: x.state._id,
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
      const cmdClone = await enrichCmd(cmd);
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
      const cmdClone = await enrichCmd(cmd);
      let dayInstance =
        (await eventRepository.getById(day, cmdClone.entityName)) || day();
      await dayInstance.scheduleAppointment(cmdClone);
      return dayInstance;
    }

    async function scheduleAppointmentInPast(cmd, continuationId) {
      logger.info(`calling ${cmd.commandName} on Day`);
      const clients = await getClientInstances(cmd);
      const cmdClone = await enrichCmd(cmd, clients);
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

      const newCmd = Object.assign({}, cmdClone, {
        appointmentId: newAppointmentId,
      });
      for (let clientInstance of clients) {
        logger.debug('associating client with appointment from past');
        await clientInstance.clientAttendsAppointment(newCmd, trainer, day);
        logger.info('saving client');
        await eventRepository.save(clientInstance, { continuationId });
      }
      return { appointmentId: newAppointmentId };
    }

    async function updateAppointmentFromPast(cmd, continuationId) {
      if (
        !cmd.isPastToFuture &&
        !cmd.isFutureToPast &&
        !cmd.changes.clients &&
        !cmd.changes.appointmentType &&
        !cmd.changes.date
      ) {
        const dayInstance = await eventRepository.getById(day, cmd.entityName);
        let origAppointment = dayInstance.getAppointment(cmd.appointmentId);

        for (let clientId of origAppointment.clients.map(x => x.clientId)) {
          let c = await eventRepository.getById(client, clientId);
          logger.debug(
            `updating appointment id: ${
              cmd.appointmentId
            } for client Id: ${clientId}`,
          );
          await c.updateAppointmentFromPast(cmd);
          await eventRepository.save(c, continuationId);
        }
        const clients = await getClientInstances(cmd);
        await dayInstance.updateAppointmentFromPast(
          await enrichCmd(cmd, clients),
          clients,
          continuationId,
        );
        await eventRepository.save(dayInstance, continuationId);
      } else {
        await removeAppointmentFromPast(
          {
            appointmentId: cmd.appointmentId,
            entityName: cmd.originalEntityName,
          },
          continuationId,
        );
        if (cmd.isPastToFuture) {
          await scheduleAppointment(cmd, continuationId);
        } else {
          await scheduleAppointmentInPast(cmd, continuationId);
        }
      }

      return {
        updateType: cmd.originalEntityName
          ? 'rescheduleAppointmentToNewDay'
          : '',
        appointmentId: cmd.appointmentId,
      };
    }

    async function removeAppointmentFromPast(cmd, continuationId) {
      let dayInstance = await eventRepository.getById(day, cmd.entityName);
      const appointmentToRemove = dayInstance.getAppointment(cmd.appointmentId);
      console.log(`==========appointmentToRemov==========`);
      console.log(appointmentToRemove);
      console.log(`==========END appointmentToRemov==========`);

      // refund clients
      let clients = appointmentToRemove.clients.map(x => x.clientId);
      for (let clientId of clients) {
        let c = await eventRepository.getById(client, clientId);
        c.returnSessionFromPast(cmd.appointmentId);
        c.removePastAppointmentForClient(
          cmd.appointmentId,
          appointmentToRemove.trainerId,
        );
        await eventRepository.save(c);
      }

      cmd.clients = clients;
      await dayInstance.removeAppointmentFromPast(cmd);
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
