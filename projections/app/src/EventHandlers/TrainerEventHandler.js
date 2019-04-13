/**
 * Created by parallels on 7/16/15.
 */

module.exports = function(rsRepository, moment, metaLogger, logger) {
  return function TrainerEventHandler() {
    logger.info('TrainerEventHandler started up');

    async function trainerHired(event) {
      rsRepository = await rsRepository;
      let trainer = {
        trainerId: event.trainerId,
        contact: event.contact,
        birthDate: event.birthDate,
        color: event.color,
        legacyId: event.legacyId,
        clients: event.clients,
        trainerClientRates: event.trainerClientRates,
        account: {
          role: event.credentials.role,
        },
        defaultTrainerClientRate: event.defaultTrainerClientRate,
      };

      return await rsRepository.save('trainer', trainer, trainer.trainerId);
    }

    async function trainerContactUpdated(event) {
      rsRepository = await rsRepository;
      let trainer = await rsRepository.getById(event.trainerId, 'trainer');
      trainer.contact.email = event.contact.email;
      trainer.contact.secondaryPhone = event.contact.secondaryPhone;
      trainer.contact.mobilePhone = event.contact.mobilePhone;
      trainer.contact.firstName = event.contact.firstName;
      trainer.contact.lastName = event.contact.lastName;
      return await rsRepository.save('trainer', trainer, trainer.trainerId);
    }

    async function trainerAddressUpdated(event) {
      rsRepository = await rsRepository;
      let trainer = await rsRepository.getById(event.trainerId, 'trainer');
      trainer.contact.address = event.address;
      return await rsRepository.save('trainer', trainer, trainer.trainerId);
    }

    async function trainerInfoUpdated(event) {
      rsRepository = await rsRepository;
      let trainer = await rsRepository.getById(event.trainerId, 'trainer');
      trainer.birthDate = event.birthDate;
      trainer.color = event.color;
      return await rsRepository.save('trainer', trainer, trainer.trainerId);
    }

    async function trainerArchived(event) {
      rsRepository = await rsRepository;
      let trainer = await rsRepository.getById(event.trainerId, 'trainer');
      trainer.archived = true;
      trainer.archivedDate = event.date;
      let sql = `UPDATE "trainer" SET "archived" = 'true', document = '${JSON.stringify(
        trainer,
      )}' 
where id = '${event.trainerId}'`;
      return await rsRepository.saveQuery(sql);
    }

    async function trainerUnarchived(event) {
      rsRepository = await rsRepository;
      let trainer = await rsRepository.getById(event.trainerId, 'trainer');
      trainer.archived = false;
      trainer.archivedDate = event.date;
      let sql = `UPDATE "trainer" SET "archived" = 'false', document = '${JSON.stringify(
        trainer,
      )}' 
where id = '${event.trainerId}'`;
      return await rsRepository.saveQuery(sql);
    }

    async function trainersClientsUpdated(event) {
      rsRepository = await rsRepository;
      let trainer = await rsRepository.getById(event.trainerId, 'trainer');
      trainer.clients = event.clients;
      return await rsRepository.save('trainer', trainer, trainer.trainerId);
    }

    async function trainersNewClientRateSet(event) {
      rsRepository = await rsRepository;
      let trainer = await rsRepository.getById(event.trainerId, 'trainer');
      trainer.trainerClientRates = trainer.trainerClientRates
        ? trainer.trainerClientRates
        : [];
      trainer.trainerClientRates.push({
        clientId: event.clientId,
        rate: event.rate,
      });
      return await rsRepository.save('trainer', trainer, trainer.trainerId);
    }

    async function trainerClientRemoved(event) {
      rsRepository = await rsRepository;
      let trainer = await rsRepository.getById(event.trainerId, 'trainer');
      trainer.trainerClientRates.filter(x => x.clientId !== event.clientId);
      return await rsRepository.save('trainer', trainer, trainer.trainerId);
    }

    async function trainersClientRateChanged(event) {
      rsRepository = await rsRepository;
      let trainer = await rsRepository.getById(event.trainerId, 'trainer');
      trainer.trainerClientRates.map(
        x =>
          x.clientId === event.clientId
            ? Object.assign(x, { rate: event.rate })
            : x,
      );
      return await rsRepository.save('trainer', trainer, trainer.trainerId);
    }

    //TODO this is fubar I think
    async function trainerPasswordUpdated(event) {
      rsRepository = await rsRepository;
      let trainer = await rsRepository.getById(event.trainerId, 'trainer');
      trainer = event.credentials.role;
      return await rsRepository.save('trainer', trainer, trainer.trainerId);
    }

    async function defaultTrainerClientRateUpdatedEvent(event) {
      rsRepository = await rsRepository;
      let trainer = await rsRepository.getById(event.trainerId, 'trainer');
      trainer.defaultTrainerClientRate = event.defaultTrainerClientRate;
      return await rsRepository.save('trainer', trainer, trainer.trainerId);
    }

    return metaLogger(
      {
        handlerName: 'TrainerEventHandler',
        trainerHired,
        trainerArchived,
        trainerUnarchived,
        trainerContactUpdated,
        trainerAddressUpdated,
        trainerInfoUpdated,
        trainersClientsUpdated,
        trainersNewClientRateSet,
        trainerClientRemoved,
        trainersClientRateChanged,
        trainerPasswordUpdated,
        defaultTrainerClientRateUpdatedEvent,
      },
      'TrainerEventHandler',
    );
  };
};
