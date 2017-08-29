/**
 * Created by parallels on 7/16/15.
 */


module.exports = function(rsRepository, moment, logger) {
  return function TrainerEventHandler() {
    logger.info('TrainerEventHandler started up');

    async function trainerHired(event) {
      logger.info('handling trainerHired event in TrainerEventHandler');
      let trainer = {
        trainerId: event.trainerId,
        contact: event.contact,
        birthDate: event.birthDate,
        color: event.color,
        clients: event.clients,
        account: {
          role: event.credentials.role
        }
      };

      return await rsRepository.save('trainer', trainer, trainer.trainerId);
    }

    async function trainerContactUpdated(event) {
      logger.info('handling trainerContactUpdated event in TrainerEventHandler');
      let trainer = await rsRepository.getById(event.trainerId, 'trainer');
      trainer.contact.email = event.contact.email;
      trainer.contact.secondaryPhone = event.contact.secondaryPhone;
      trainer.contact.mobilePhone = event.contact.mobilePhone;
      trainer.contact.firstName = event.contact.firstName;
      trainer.contact.lastName = event.contact.lastName;
      return await rsRepository.save('trainer', trainer, trainer.trainerId);
    }

    async function trainerAddressUpdated(event) {
      logger.info('handling trainerAddressUpdated event in TrainerEventHandler');
      let trainer = await rsRepository.getById(event.trainerId, 'trainer');
      trainer.contact.address = event.address;
      return await rsRepository.save('trainer', trainer, trainer.trainerId);
    }

    async function trainerInfoUpdated(event) {
      logger.info('handling trainerInfoUpdated event in TrainerEventHandler');
      let trainer = await rsRepository.getById(event.trainerId, 'trainer');
      trainer.birthDate = event.birthDate;
      trainer.color = event.color;
      return await rsRepository.save('trainer', trainer, trainer.trainerId);
    }

    async function trainerArchived(event) {
      logger.info('handling trainerArchived event in TrainerEventHandler');
      let trainer = await rsRepository.getById(event.trainerId, 'trainer');
      trainer.archived = true;
      trainer.archivedDate = moment().format();
      let sql = `UPDATE "trainer" SET "archived" = 'true', document = '${JSON.stringify(trainer)}' 
where id = '${event.trainerId}'`;
      return await rsRepository.saveQuery(sql);
    }

    async function trainerUnArchived(event) {
      logger.info('handling trainerUnArchived event in TrainerEventHandler');
      let trainer = await rsRepository.getById(event.trainerId, 'trainer');
      trainer.archived = false;
      trainer.archivedDate = moment().format();
      let sql = `UPDATE "trainer" SET "archived" = 'false', document = '${JSON.stringify(trainer)}' 
where id = '${event.trainerId}'`;
      return await rsRepository.saveQuery(sql);
    }

    async function trainersClientsUpdated(event) {
      logger.info('handling trainersClientsUpdated event in TrainerEventHandler');
      let trainer = await rsRepository.getById(event.trainerId, 'trainer');
      trainer.clients = event.clients;
      return await rsRepository.save('trainer', trainer, trainer.trainerId);
    }

    async function trainersNewClientRateSet(event) {
      logger.info('handling trainersNewClientRateSet event in TrainerEventHandler');
      let trainer = await rsRepository.getById(event.trainerId, 'trainer');
      trainer.trainerClientRates = trainer.trainerClientRates ? trainer.trainerClientRates : [];
      trainer.trainerClientRates.push({clientId: event.clientId, rate: event.rate});
      return await rsRepository.save('trainer', trainer, trainer.trainerId);
    }

    async function trainerClientRemoved(event) {
      logger.info('handling trainerClientRemoved event in TrainerEventHandler');
      let trainer = await rsRepository.getById(event.trainerId, 'trainer');
      trainer.trainerClientRates.filter( x => x.clientId !== event.clientId );
      return await rsRepository.save('trainer', trainer, trainer.trainerId);
    }

    async function trainersClientRateChanged(event) {
      logger.info('handling trainersClientRateChanged event in TrainerEventHandler');
      let trainer = await rsRepository.getById(event.trainerId, 'trainer');
      trainer.trainerClientRates.map(x => x.clientId === event.clientId ? Object.assign(x, {rate: event.rate}) : x);
      return await rsRepository.save('trainer', trainer, trainer.trainerId);
    }

    async function trainerPasswordUpdated(event) {
      logger.info('handling trainerPasswordUpdated event in TrainerEventHandler');
      let trainer = await rsRepository.getById(event.trainerId, 'trainer');
      trainer = event.credentials.role;
      return await rsRepository.save('trainer', trainer, trainer.trainerId);
    }

    return {
      handlerName: 'TrainerEventHandler',
      trainerHired,
      trainerArchived,
      trainerUnArchived,
      trainerContactUpdated,
      trainerAddressUpdated,
      trainerInfoUpdated,
      trainersClientsUpdated,
      trainersNewClientRateSet,
      trainerClientRemoved,
      trainersClientRateChanged,
      trainerPasswordUpdated
    };
  };
};
