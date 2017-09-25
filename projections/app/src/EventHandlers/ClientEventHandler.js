/**
 * Created by parallels on 7/16/15.
 */


module.exports = function(rsRepository, moment, logger) {
  return function ClientEventHandler() {
    logger.info('ClientEventHandler started up');

    async function clientAdded(event) {
      logger.info('handling clientAdded event in ClientEventHandler');
      let client = {
        clientId: event.clientId,
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
      return await rsRepository.save('client', client, client.clientId);
    }

    async function clientContactUpdated(event) {
      logger.info('handling clientContactUpdated event in ClientEventHandler');
      let client = await rsRepository.getById(event.clientId, 'client');
      client.contact.email = event.contact.email;
      client.contact.secondaryPhone = event.contact.secondaryPhone;
      client.contact.mobilePhone = event.contact.mobilePhone;
      return await rsRepository.save('client', client, client.clientId);
    }

    async function clientAddressUpdated(event) {
      logger.info('handling clientAddressUpdated event in ClientEventHandler');
      let client = await rsRepository.getById(event.clientId, 'client');
      client.contact.address = event.address;
      return await rsRepository.save('client', client, client.clientId);
    }

    async function clientInfoUpdated(event) {
      logger.info('handling clientInfoUpdated event in ClientEventHandler');
      let client = await rsRepository.getById(event.clientId, 'client');
      client.contact.firstName = event.firstName;
      client.contact.lastName = event.lastName;
      client.birthDate = event.birthDate;
      return await rsRepository.save('client', client, client.clientId);
    }

    async function clientSourceUpdated(event) {
      logger.info('handling clientSourceUpdated event in ClientEventHandler');
      let client = await rsRepository.getById(event.clientId, 'client');
      client.source = event.source;
      client.sourceNotes = event.sourceNotes;
      client.startDate = event.startDate;
      return await rsRepository.save('client', client, client.clientId);
    }

    async function clientArchived(event) {
      logger.info('handling clientArchived event in ClientEventHandler');
      let client = await rsRepository.getById(event.clientId, 'client');
      client.archived = true;
      client.archivedDate = moment().toISOString();
      let sql = `UPDATE "client" SET "archived" = 'true', document = '${JSON.stringify(client)}' 
where id = '${event.clientId}'`;
      return await rsRepository.saveQuery(sql);
    }

    async function clientUnArchived(event) {
      logger.info('handling clientUnArchived event in ClientEventHandler');
      let client = await rsRepository.getById(event.clientId, 'client');
      client.archived = false;
      client.archivedDate = moment().toISOString();
      let sql = `UPDATE "client" SET "archived" = 'false', document = '${JSON.stringify(client)}' 
where id = '${event.clientId}'`;
      return await rsRepository.saveQuery(sql);
    }

    async function sessionsPurchased(event) {
      logger.info('handling sessionsPurchased event in ClientEventHandler');
      let client = await rsRepository.getById(event.clientId, 'client');
      client.inventory = {
        fullHour: (client.inventory.fullHour || 0) + (event.fullHourTenPack * 10) + event.fullHour,
        halfHour: (client.inventory.halfHour || 0) + (event.halfHourTenPack * 10) + event.halfHour,
        pair: (client.inventory.pair || 0) + (event.pairTenPack * 10) + event.pair
      };
      return await rsRepository.save('client', client, client.clientId);
    }

    async function unfundedAppointmentAttendedByClient(event) {
      return await appointmentAttendedByClient(event);
    }

    async function appointmentAttendedByClient(event) {
      logger.info('handling appointmentAttendedByClient event in ClientEventHandler');
      let client = await rsRepository.getById(event.clientId, 'client');
      client.inventory[event.appointmentType] = client.inventory[event.appointmentType] - 1;
      return await rsRepository.save('client', client, client.clientId);
    }

    async function sessionsRefunded(event) {
      logger.info('handling sessionsRefunded event in ClientEventHandler');
      let client = await rsRepository.getById(event.clientId, 'client');
      event.refundSessions.forEach(x => client.inventory[x.appointmentType] = client.inventory[x.appointmentType] + 1);
      return await rsRepository.save('client', client, client.clientId);
    }

    async function unfundedAppointmentRemoveForClient(event) {
      return await sessionReturnedFromPastAppointment(event);
    }
    async function sessionReturnedFromPastAppointment(event) {
      logger.info('handling sessionReturnedFromPastAppointment event in ClientEventHandler');
      let client = await rsRepository.getById(event.clientId, 'client');
      client.inventory[event.appointmentType] = client.inventory[event.appointmentType] + 1;
      return await rsRepository.save('client', client, client.clientId);
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
      sessionsRefunded,
      sessionReturnedFromPastAppointment,
      unfundedAppointmentRemoveForClient
    };
  };
};
