/**
 * Created by parallels on 7/16/15.
 */
'use strict';

module.exports = function(rsRepository, moment, logger) {
  return function TrainerEventHandler() {
    logger.info('TrainerEventHandler started up');

    async function trainerHired(event) {
      var trainer = {
        id: event.id,
        contact: event.contact,
        birthDate: event.birthDate,
        color: event.color,
        clients: event.clients
      };

      return await rsRepository.save('trainer', trainer);
    }

    async function trainerContactUpdated(event) {
      var trainer = await rsRepository.getById(event.id, 'trainer');
      trainer.contact.email = event.contact.email;
      trainer.contact.secondaryPhone = event.contact.secondaryPhone;
      trainer.contact.mobilePhone = event.contact.mobilePhone;
      return await rsRepository.save('trainer', trainer, event.id);
    }

    async function trainerAddressUpdated(event) {
      var trainer = await rsRepository.getById(event.id, 'trainer');
      trainer.contact.address = event.address;
      return await rsRepository.save('trainer', trainer, event.id);
    }

    async function trainerInfoUpdated(event) {
      var trainer = await rsRepository.getById(event.id, 'trainer');
      trainer.contact.firstName = event.firstName;
      trainer.contact.lastName = event.lastName;
      trainer.birthDate = event.birthDate;
      trainer.color = event.color;
      return await rsRepository.save('trainer', trainer, event.id);
    }

    async function trainerArchived(event) {
      var trainer = await rsRepository.getById(event.id, 'trainer');
      trainer.archived = true;
      trainer.archivedDate = moment().toISOString();
      var sql = `UPDATE "trainer" SET "archived" = 'true', document = '${JSON.stringify(trainer)}' where id = '${event.id}'`;
      return await rsRepository.saveQuery(sql);
    }

    async function trainerUnArchived(event) {
      var trainer = await rsRepository.getById(event.id, 'trainer');
      trainer.archived = false;
      trainer.archivedDate = moment().toISOString();
      var sql = `UPDATE "trainer" SET "archived" = 'false', document = '${JSON.stringify(trainer)}' where id = '${event.id}'`;
      return await rsRepository.saveQuery(sql);
    }

    async function trainersClientsUpdated(event) {
      var trainer = await rsRepository.getById(event.id, 'trainer');
      trainer.clients = event.clients;
      return await rsRepository.save('trainer', trainer, event.id);
    }

    async function clientArchived(event) {
      var client = await rsRepository.getById(event.id, 'client');
      client.archived = true;
      client.archivedDate = moment().toISOString();
      var sql = `UPDATE "client" SET "archived" = 'true', document = '${JSON.stringify(client)}' where id = '${event.id}'`;
      return await rsRepository.saveQuery(sql);
    }

    return {
      handlerName: 'TrainerEventHandler',
      trainerHired,
      trainerArchived,
      trainerUnArchived,
      trainerContactUpdated,
      trainerAddressUpdated,
      trainerInfoUpdated,
      trainersClientsUpdated
    };
  };
};
