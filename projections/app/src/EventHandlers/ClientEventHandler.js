/**
 * Created by parallels on 7/16/15.
 */

module.exports = function(rsRepository, moment, metaLogger, logger) {
  return function ClientEventHandler() {
    logger.info('ClientEventHandler started up');
    async function clientAdded(event) {
      rsRepository = await rsRepository;
      let client = {
        clientId: event.clientId,
        legacyId: event.legacyId,
        source: event.source,
        sourceNotes: event.sourceNotes,
        startDate: event.startDate,
        birthDate: event.birthDate,
        contact: event.contact,
        inventory: {
          fullHour: 0,
          halfHour: 0,
          pair: 0,
        },
      };
      return await rsRepository.save('client', client, client.clientId);
    }

    async function clientContactUpdated(event) {
      rsRepository = await rsRepository;
      let client = await rsRepository.getById(event.clientId, 'client');
      client.contact.email = event.contact.email;
      client.contact.secondaryPhone = event.contact.secondaryPhone;
      client.contact.mobilePhone = event.contact.mobilePhone;
      return await rsRepository.save('client', client, client.clientId);
    }

    async function clientAddressUpdated(event) {
      rsRepository = await rsRepository;
      let client = await rsRepository.getById(event.clientId, 'client');
      client.contact.address = event.address;
      return await rsRepository.save('client', client, client.clientId);
    }

    async function clientInfoUpdated(event) {
      rsRepository = await rsRepository;
      let client = await rsRepository.getById(event.clientId, 'client');
      client.contact.firstName = event.firstName;
      client.contact.lastName = event.lastName;
      client.birthDate = event.birthDate;
      return await rsRepository.save('client', client, client.clientId);
    }

    async function clientSourceUpdated(event) {
      rsRepository = await rsRepository;
      let client = await rsRepository.getById(event.clientId, 'client');
      client.source = event.source;
      client.sourceNotes = event.sourceNotes;
      client.startDate = event.startDate;
      return await rsRepository.save('client', client, client.clientId);
    }

    async function clientArchived(event) {
      rsRepository = await rsRepository;
      let client = await rsRepository.getById(event.clientId, 'client');
      client.archived = true;
      client.archivedDate = event.date;
      let sql = `UPDATE "client" SET "archived" = 'true', document = '${JSON.stringify(
        client,
      )}' 
where id = '${event.clientId}'`;
      return await rsRepository.saveQuery(sql);
    }

    async function clientUnarchived(event) {
      rsRepository = await rsRepository;
      let client = await rsRepository.getById(event.clientId, 'client');
      client.archived = false;
      client.archivedDate = event.date;
      let sql = `UPDATE "client" SET "archived" = 'false', document = '${JSON.stringify(
        client,
      )}' 
where id = '${event.clientId}'`;
      return await rsRepository.saveQuery(sql);
    }

    async function sessionsPurchased(event) {
      rsRepository = await rsRepository;
      let client = await rsRepository.getById(event.clientId, 'client');
      client.inventory = {
        fullHour:
          (client.inventory.fullHour || 0) +
          event.fullHourTenPack * 10 +
          event.fullHour,
        halfHour:
          (client.inventory.halfHour || 0) +
          event.halfHourTenPack * 10 +
          event.halfHour,
        pair:
          (client.inventory.pair || 0) + event.pairTenPack * 10 + event.pair,
      };
      return await rsRepository.save('client', client, client.clientId);
    }

    async function unfundedAppointmentAttendedByClient(event) {
      return await fundedAppointmentAttendedByClient(event);
    }

    async function fundedAppointmentAttendedByClient(event) {
      rsRepository = await rsRepository;
      let client = await rsRepository.getById(event.clientId, 'client');
      client.inventory[event.appointmentType] =
        client.inventory[event.appointmentType] - 1;
      return await rsRepository.save('client', client, client.clientId);
    }

    async function sessionsRefunded(event) {
      rsRepository = await rsRepository;
      let client = await rsRepository.getById(event.clientId, 'client');
      event.refundSessions.forEach(
        x =>
          (client.inventory[x.appointmentType] =
            client.inventory[x.appointmentType] - 1),
      );
      return await rsRepository.save('client', client, client.clientId);
    }

    async function unfundedAppointmentRemovedForClient(event) {
      return await sessionReturnedFromPastAppointment(event);
    }

    // this is basically fundedAppointmentRemoved and session wasn't transfered
    // or appointment updated client or type
    // seems like it should just catch the 'fundedAppointmentRemoveForClient' event
    // but not all of those cause the refund of the session
    async function sessionReturnedFromPastAppointment(event) {
      rsRepository = await rsRepository;
      let client = await rsRepository.getById(event.clientId, 'client');
      client.inventory[event.appointmentType] =
        client.inventory[event.appointmentType] + 1;
      return await rsRepository.save('client', client, client.clientId);
    }

    return metaLogger(
      {
        handlerName: 'ClientEventHandler',
        clientAdded,
        clientArchived,
        clientUnarchived,
        clientContactUpdated,
        clientAddressUpdated,
        clientInfoUpdated,
        clientSourceUpdated,
        sessionsPurchased,
        fundedAppointmentAttendedByClient,
        unfundedAppointmentAttendedByClient,
        sessionsRefunded,
        sessionReturnedFromPastAppointment,
        unfundedAppointmentRemovedForClient,
      },
      'ClientEventHandler',
    );
  };
};
