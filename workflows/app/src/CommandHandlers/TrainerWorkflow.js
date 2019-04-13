module.exports = function(
  eventRepository,
  logger,
  metaLogger,
  trainer,
  client,
) {
  return function TrainerWorkflow() {
    // async function loginTrainer(cmd, continuationId ) {
    //   throw new Error('yo! wtf!');
    //     var trainer = await eventRepository.getById(trainer, cmd.id, 5);
    //     trainer.loginTrainer(cmd);
    //     return await eventRepository.save(trainer, { continuationId });
    // }

    async function hireTrainer(cmd, continuationId) {
      let trainerInstance = trainer();
      trainerInstance.hireTrainer(cmd);

      logger.info('saving trainerInstance');
      logger.trace(trainerInstance);

      await eventRepository.save(trainerInstance, { continuationId });
      return { trainerId: trainerInstance.state._id };
    }

    async function updateTrainerAddress(cmd, continuationId) {
      let trainerInstance = await eventRepository.getById(
        trainer,
        cmd.trainerId,
      );
      trainerInstance.updateTrainerAddress(cmd);

      logger.info('saving trainerInstance');
      logger.trace(trainerInstance);

      await eventRepository.save(trainerInstance, { continuationId });
      return { trainerId: trainerInstance.state._id };
    }

    async function updateTrainerContact(cmd, continuationId) {
      let trainerInstance = await eventRepository.getById(
        trainer,
        cmd.trainerId,
      );
      trainerInstance.updateTrainerContact(cmd);

      logger.info('saving trainerInstance');
      logger.trace(trainerInstance);

      await eventRepository.save(trainerInstance, { continuationId });
      return { trainerId: trainerInstance.state._id };
    }

    async function updateTrainerPassword(cmd, continuationId) {
      let trainerInstance = await eventRepository.getById(
        trainer,
        cmd.trainerId,
      );
      trainerInstance.updateTrainerPassword(cmd);

      logger.info('saving trainerInstance');
      logger.trace(trainerInstance);

      await eventRepository.save(trainerInstance, { continuationId });
      return { trainerId: trainerInstance.state._id };
    }

    async function updateTrainerInfo(cmd, continuationId) {
      let trainerInstance = await eventRepository.getById(
        trainer,
        cmd.trainerId,
      );
      trainerInstance.updateTrainerInfo(cmd);

      logger.info('saving trainerInstance');
      logger.trace(trainerInstance);

      await eventRepository.save(trainerInstance, { continuationId });
      return { trainerId: trainerInstance.state._id };
    }

    async function updateTrainersClients(cmd, continuationId) {
      let trainerInstance = await eventRepository.getById(
        trainer,
        cmd.trainerId,
      );
      trainerInstance.updateTrainersClients(cmd);

      logger.info('saving trainerInstance');
      logger.trace(trainerInstance);

      await eventRepository.save(trainerInstance, { continuationId });
      return { trainerId: trainerInstance.state._id };
    }

    async function updateTrainersClientRates(cmd, continuationId) {
      let trainerInstance = await eventRepository.getById(
        trainer,
        cmd.trainerId,
      );
      trainerInstance.updateTrainersClientRates(cmd);

      logger.info('saving trainerInstance');
      logger.trace(trainerInstance);

      await eventRepository.save(trainerInstance, { continuationId });
      return { trainerId: trainerInstance.state._id };
    }

    async function archiveTrainer(cmd, continuationId) {
      let trainerInstance = await eventRepository.getById(
        trainer,
        cmd.trainerId,
      );
      trainerInstance.archiveTrainer(cmd);

      logger.info('saving trainerInstance');
      logger.trace(trainerInstance);

      await eventRepository.save(trainerInstance, { continuationId });
      return { trainerId: trainerInstance.state._id };
    }

    async function unArchiveTrainer(cmd, continuationId) {
      let trainerInstance = await eventRepository.getById(
        trainer,
        cmd.trainerId,
      );
      trainerInstance.unArchiveTrainer(cmd);

      logger.info('saving trainerInstance');
      logger.trace(trainerInstance);

      await eventRepository.save(trainerInstance, { continuationId });
      return { trainerId: trainerInstance.state._id };
    }

    async function verifyAppointments(cmd, continuationId) {
      let trainerInstance = await eventRepository.getById(
        trainer,
        cmd.trainerId,
      );
      trainerInstance.verifyAppointments(cmd);
      logger.info('saving trainerInstance');
      logger.trace(trainerInstance);

      await eventRepository.save(trainerInstance, { continuationId });
      return { trainerId: trainerInstance.state._id };
    }

    async function payTrainer(cmd, continuationId) {
      let trainerInstance = await eventRepository.getById(
        trainer,
        cmd.trainerId,
      );
      // This is actually the client aggregate root, injected above retrieving client instance
      await trainerInstance.payTrainer(cmd, client);
      logger.info('saving trainerInstance');
      logger.trace(trainerInstance);
      await eventRepository.save(trainerInstance, { continuationId });
      return { trainerId: trainerInstance.state._id };
    }

    async function updateDefaultTrainerClientRate(cmd, continuationId) {
      let trainerInstance = await eventRepository.getById(
        trainer,
        cmd.trainerId,
      );
      await trainerInstance.updateDefaultTrainerClientRate(cmd);
      logger.info('saving trainerInstance');
      logger.trace(trainerInstance);
      await eventRepository.save(trainerInstance, { continuationId });
      return { trainerId: trainerInstance.state._id };
    }

    return metaLogger(
      {
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
        payTrainer,
        updateDefaultTrainerClientRate,
      },
      'TrainerWorkflow',
    );
  };
};
