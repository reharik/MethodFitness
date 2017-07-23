/**
 * Created by parallels on 7/16/15.
 */


module.exports = function(rsRepository, moment, logger) {
  return function ClientEventHandler() {
    logger.info('ClientEventHandler started up');

    async function clientAdded(event) {
      let client = {
        id: event.id,
        source: event.source,
        sourceNotes: event.sourceNotes,
        startDate: event.startDate,
        birthDate: event.birthDate,
        contact: event.contact,
        inventory: {
          fullHour: 0,
          halfHour: 0,
          pair: 0
        }
      };
      return await rsRepository.save('client', client);
    }

    async function clientContactUpdated(event) {
      let client = await rsRepository.getById(event.id, 'client');
      client.contact.firstName = event.firstName;
      client.contact.lastName = event.lastName;
      client.contact.email = event.contact.email;
      client.contact.secondaryPhone = event.contact.secondaryPhone;
      client.contact.mobilePhone = event.contact.mobilePhone;
      return await rsRepository.save('client', client);
    }

    async function clientAddressUpdated(event) {
      let client = await rsRepository.getById(event.id, 'client');
      client.contact.address = event.address;
      return await rsRepository.save('client', client);
    }

    async function clientInfoUpdated(event) {
      let client = await rsRepository.getById(event.id, 'client');
      client.birthDate = event.birthDate;
      client.color = event.color;
      return await rsRepository.save('client', client);
    }

    async function clientSourceUpdated(event) {
      let client = await rsRepository.getById(event.id, 'client');
      client.source = event.source;
      client.sourceNotes = event.sourceNotes;
      client.startDate = event.startDate;
      return await rsRepository.save('client', client);
    }

    async function clientArchived(event) {
      let client = await rsRepository.getById(event.id, 'client');
      client.archived = true;
      client.archivedDate = moment().toISOString();
      let sql = `UPDATE "client" SET "archived" = 'true', document = '${JSON.stringify(client)}' 
where id = '${event.id}'`;
      return await rsRepository.saveQuery(sql);
    }

    async function clientUnArchived(event) {
      let client = await rsRepository.getById(event.id, 'client');
      client.archived = false;
      client.archivedDate = moment().toISOString();
      let sql = `UPDATE "client" SET "archived" = 'false', document = '${JSON.stringify(client)}' 
where id = '${event.id}'`;
      return await rsRepository.saveQuery(sql);
    }

    async function sessionsPurchased(event) {
      logger.info('handling clientInventoryUpdated event');
      let client = await rsRepository.getById(event.clientId, 'client');
      client.inventory = {
        fullHour: (client.inventory.fullHour || 0) + (event.fullHourTenPack * 10) + event.fullHour,
        halfHour: (client.inventory.halfHour || 0) + (event.halfHourTenPack * 10) + event.halfHour,
        pair: (client.inventory.pair || 0) + (event.pairTenPack * 10) + event.pair
      };
      return await rsRepository.save('client', client);
    }

    async function unfundedAppointmentAttendedByClient(event) {
      return await appointmentAttendedByClient(event);
    }

    async function appointmentAttendedByClient(event) {
      logger.info('handling appointmentAttendedByClient event');
      let client = await rsRepository.getById(event.clientId, 'client');
      client.inventory[event.appointmentType] = client.inventory[event.appointmentType] - 1;
      return await rsRepository.save('client', client);
    }

    async function sessionsRefunded(event) {
      logger.info('handling sessionsRefunded event');
      let client = await rsRepository.getById(event.clientId, 'client');
      event.refundSessions.forEach(x => client.inventory[x.appointmentType] = client.inventory[x.appointmentType] - 1);
      return await rsRepository.save('client', client);
    }

    return {
      handlerName: 'ClientEventHandler',
      clientAdded,
      clientArchived,
      clientUnArchived,
      clientContactUpdated,
      clientAddressUpdated,
      clientInfoUpdated,
      clientSourceUpdated,
      sessionsPurchased,
      appointmentAttendedByClient,
      unfundedAppointmentAttendedByClient,
      sessionsRefunded
    };
  };
};
