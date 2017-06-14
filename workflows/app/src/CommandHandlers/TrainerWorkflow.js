/**
 * Created by parallels on 7/16/15.
 */


module.exports = function(eventRepository, logger, Trainer) {
  return function TrainerWorkflow() {
    // async function loginTrainer(cmd, continuationId ) {
    //   throw new Error('yo! wtf!');
    //     var trainer = await eventRepository.getById(Trainer, cmd.id, 5);
    //     trainer.loginTrainer(cmd);
    //     return await eventRepository.save(trainer, { continuationId });
    // }

    async function hireTrainer(cmd, continuationId) {
      logger.info('calling hiretrainer');
      let trainer = new Trainer();
      trainer.hireTrainer(cmd);

      logger.info('saving trainer');
      logger.trace(trainer);

      await eventRepository.save(trainer, { continuationId });
      return { trainerId: trainer._id };
    }

    async function updateTrainerAddress(cmd, continuationId) {
      logger.info('calling updateTrainerAddress');
      let trainer = await eventRepository.getById(Trainer, cmd.id);
      trainer.updateTrainerAddress(cmd);

      logger.info('saving trainer');
      logger.trace(trainer);

      await eventRepository.save(trainer, { continuationId });
      return { trainerId: trainer._id };
    }

    async function updateTrainerContact(cmd, continuationId) {
      logger.info('calling updateTrainerContact');
      let trainer = await eventRepository.getById(Trainer, cmd.id);
      trainer.updateTrainerContact(cmd);

      logger.info('saving trainer');
      logger.trace(trainer);

      await eventRepository.save(trainer, { continuationId });
      return { trainerId: trainer._id };
    }

    async function updateTrainerPassword(cmd, continuationId) {
      logger.info('calling updateTrainerPassword');
      let trainer = await eventRepository.getById(Trainer, cmd.id);
      trainer.updateTrainerPassword(cmd);

      logger.info('saving trainer');
      logger.trace(trainer);

      await eventRepository.save(trainer, { continuationId });
      return { trainerId: trainer._id };
    }

    async function updateTrainerInfo(cmd, continuationId) {
      logger.info('calling updateTrainerInfo');

      let trainer = await eventRepository.getById(Trainer, cmd.id);
      trainer.updateTrainerInfo(cmd);

      logger.info('saving trainer');
      logger.trace(trainer);

      await eventRepository.save(trainer, { continuationId });
      return { trainerId: trainer._id };
    }

    async function updateTrainersClients(cmd, continuationId) {
      logger.info('calling updateTrainersClients');

      let trainer = await eventRepository.getById(Trainer, cmd.id);
      trainer.updateTrainersClients(cmd);

      logger.info('saving trainer');
      logger.trace(trainer);

      await eventRepository.save(trainer, { continuationId });
      return { trainerId: trainer._id };
    }

    async function archiveTrainer(cmd, continuationId) {
      logger.info('calling archiveTrainer');

      let trainer = await eventRepository.getById(Trainer, cmd.id);
      trainer.archiveTrainer(cmd);

      logger.info('saving trainer');
      logger.trace(trainer);

      await eventRepository.save(trainer, { continuationId });
      return { trainerId: trainer._id };
    }

    async function unArchiveTrainer(cmd, continuationId) {
      logger.info('calling unArchiveTrainer');

      let trainer = await eventRepository.getById(Trainer, cmd.id);
      trainer.unArchiveTrainer(cmd);

      logger.info('saving trainer');
      logger.trace(trainer);

      await eventRepository.save(trainer, { continuationId });
      return { trainerId: trainer._id };
    }

    async function verifySessions(cmd, continuationId) {
      logger.info('verifying Sessions');

      let trainer = await eventRepository.getById(Trainer, cmd.trainerId);
      trainer.verifyAppointments(cmd);
      logger.info('saving trainer');
      logger.trace(trainer);

      await eventRepository.save(trainer, { continuationId });
      return { trainerId: trainer._id };
    }

    return {
      handlerName: 'TrainerWorkflow',
      hireTrainer,
      updateTrainerInfo,
      updateTrainerAddress,
      updateTrainerPassword,
      updateTrainerContact,
      updateTrainersClients,
      archiveTrainer,
      unArchiveTrainer,
      verifySessions
    };
  };
};
