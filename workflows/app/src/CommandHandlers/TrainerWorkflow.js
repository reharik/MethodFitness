module.exports = function(eventRepository, logger, trainer) {
  return function TrainerWorkflow() {
    // async function loginTrainer(cmd, continuationId ) {
    //   throw new Error('yo! wtf!');
    //     var trainer = await eventRepository.getById(trainer, cmd.id, 5);
    //     trainer.loginTrainer(cmd);
    //     return await eventRepository.save(trainer, { continuationId });
    // }

    async function hireTrainer(cmd, continuationId) {
      logger.info('calling hiretrainer');
      let trainerInstance = trainer();
      trainerInstance.hireTrainer(cmd);

      logger.info('saving trainerInstance');
      logger.trace(trainerInstance);

      await eventRepository.save(trainerInstance, { continuationId });
      return { trainerId: trainerInstance.state._id };
    }

    async function updateTrainerAddress(cmd, continuationId) {
      logger.info('calling updateTrainerAddress');
      let trainerInstance = await eventRepository.getById(trainer, cmd.trainerId);
      trainerInstance.updateTrainerAddress(cmd);

      logger.info('saving trainerInstance');
      logger.trace(trainerInstance);

      await eventRepository.save(trainerInstance, { continuationId });
      return { trainerId: trainerInstance.state._id };
    }

    async function updateTrainerContact(cmd, continuationId) {
      logger.info('calling updateTrainerContact');
      let trainerInstance = await eventRepository.getById(trainer, cmd.trainerId);
      trainerInstance.updateTrainerContact(cmd);

      logger.info('saving trainerInstance');
      logger.trace(trainerInstance);

      await eventRepository.save(trainerInstance, { continuationId });
      return { trainerId: trainerInstance.state._id };
    }

    async function updateTrainerPassword(cmd, continuationId) {
      logger.info('calling updateTrainerPassword');
      let trainerInstance = await eventRepository.getById(trainer, cmd.trainerId);
      trainerInstance.updateTrainerPassword(cmd);

      logger.info('saving trainerInstance');
      logger.trace(trainerInstance);

      await eventRepository.save(trainerInstance, { continuationId });
      return { trainerId: trainerInstance.state._id };
    }

    async function updateTrainerInfo(cmd, continuationId) {
      logger.info('calling updateTrainerInfo');

      let trainerInstance = await eventRepository.getById(trainer, cmd.trainerId);
      trainerInstance.updateTrainerInfo(cmd);

      logger.info('saving trainerInstance');
      logger.trace(trainerInstance);

      await eventRepository.save(trainerInstance, { continuationId });
      return { trainerId: trainerInstance.state._id };
    }

    async function updateTrainersClients(cmd, continuationId) {
      logger.info('calling updateTrainersClients');

      let trainerInstance = await eventRepository.getById(trainer, cmd.trainerId);
      trainerInstance.updateTrainersClients(cmd);

      logger.info('saving trainerInstance');
      logger.trace(trainerInstance);

      await eventRepository.save(trainerInstance, { continuationId });
      return { trainerId: trainerInstance.state._id };
    }

    async function updateTrainersClientRates(cmd, continuationId) {
      logger.info('calling updateTrainersClientRates');

      let trainerInstance = await eventRepository.getById(trainer, cmd.trainerId);
      trainerInstance.updateTrainersClientRates(cmd);

      logger.info('saving trainerInstance');
      logger.trace(trainerInstance);

      await eventRepository.save(trainerInstance, { continuationId });
      return { trainerId: trainerInstance.state._id };
    }

    async function archiveTrainer(cmd, continuationId) {
      logger.info('calling archiveTrainer');

      let trainerInstance = await eventRepository.getById(trainer, cmd.trainerId);
      trainerInstance.archiveTrainer(cmd);

      logger.info('saving trainerInstance');
      logger.trace(trainerInstance);

      await eventRepository.save(trainerInstance, { continuationId });
      return { trainerId: trainerInstance.state._id };
    }

    async function unArchiveTrainer(cmd, continuationId) {
      logger.info('calling unArchiveTrainer');

      let trainerInstance = await eventRepository.getById(trainer, cmd.trainerId);
      trainerInstance.unArchiveTrainer(cmd);

      logger.info('saving trainerInstance');
      logger.trace(trainerInstance);

      await eventRepository.save(trainerInstance, { continuationId });
      return { trainerId: trainerInstance.state._id };
    }

    async function verifyAppointments(cmd, continuationId) {
      logger.info('verifying Appointments');

      let trainerInstance = await eventRepository.getById(trainer, cmd.trainerId);
      trainerInstance.verifyAppointments(cmd);
      logger.info('saving trainerInstance');
      logger.trace(trainerInstance);

      await eventRepository.save(trainerInstance, { continuationId });
      return { trainerId: trainerInstance.state._id };
    }

    async function payTrainer(cmd, continuationId) {
      logger.info('Paying trainerInstance');

      let trainerInstance = await eventRepository.getById(trainer, cmd.trainerId);
      trainerInstance.payTrainer(cmd);
      logger.info('saving trainerInstance');
      logger.trace(trainerInstance);
      await eventRepository.save(trainerInstance, { continuationId });
      return { trainerId: trainerInstance.state._id };
    }

    return {
      handlerName: 'TrainerWorkflow',
      hireTrainer,
      updateTrainerInfo,
      updateTrainerAddress,
      updateTrainerPassword,
      updateTrainerContact,
      updateTrainersClients,
      updateTrainersClientRates,
      archiveTrainer,
      unArchiveTrainer,
      verifyAppointments,
      payTrainer
    };
  };
};
