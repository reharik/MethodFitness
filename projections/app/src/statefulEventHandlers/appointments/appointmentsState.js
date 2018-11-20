module.exports = function(invariant, R, rsRepository, logger, metaLogger) {
  return innerState => {
    const appointmentScheduled = event => {
      const location = innerState.locations.find(
        x => x.locationId === event.locationId,
      );
      const locationName = location ? location.name : undefined;
      const clientNames = event.clients.map(client => {
        const clientInstance = innerState.clients.find(
          x => x.clientId === client,
        );
        return `${clientInstance.lastName}, ${clientInstance.firstName}`;
      });
      return Object.assign({}, event, { location: locationName, clientNames });
    };

    const appointmentUpdated = async (event, completed) => {
      rsRepository = await rsRepository;
      let appointment = await rsRepository.getById(
        event.appointmentId,
        'appointment',
      );
      const location = innerState.locations.find(
        x => x.locationId === event.locationId,
      );
      const locationName = location ? location.name : undefined;

      const clients = event.clients
        ? event.clients
        : event.clientId
          ? [event.clientId]
          : [];
      const clientNames = clients.map(client => {
        const clientInstance = innerState.clients.find(
          x => x.clientId === client,
        );
        return `${clientInstance.lastName}, ${clientInstance.firstName}`;
      });
      return Object.assign({}, appointment, {
        appointmentType: event.appointmentType,
        enttityName: event.enttityName,
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        trainerId: event.trainerId,
        clients: event.clients,
        notes: event.notes,
        completed,
        sessionId: completed ? event.SessionId : undefined,
        locationId: event.locationId,
        location: locationName,
        clientNames,
      });
    };

    const appointmentCompleted = async event => {
      rsRepository = await rsRepository;
      let appointment = await rsRepository.getById(
        event.appointmentId,
        'appointment',
      );
      return Object.assign({}, appointment, {
        completed: true,
        sessionId: event.SessionId,
      });
    };

    const trainerPaid = async event => {
      rsRepository = await rsRepository;
      const appointmentIds = event.paidAppointments.map(x => x.appointmentId);
      let appointments = await rsRepository.getByIds(
        appointmentIds,
        'appointment',
      );
      return appointments.map(appointment =>
        Object.extend({}, appointment, { paid: true }),
      );
    };

    const trainerInfoUpdated = async event => {
      rsRepository = await rsRepository;
      let selectSql = `select * FROM "appointment" where document->>'trainerId' = '${
        event.trainerId
      }'`;
      let appointments = await rsRepository.query(selectSql);
      return appointments.map(appointment =>
        Object.extend({}, appointment, { color: event.color }),
      );
    };

    const locationUpdated = async event => {
      rsRepository = await rsRepository;
      innerState.locations = innerState.locations.map(
        x =>
          x.locationId === event.locationId
            ? Object.assign({}, x, { name: event.name })
            : x,
      );

      let selectSql = `select * FROM "appointment" where document->>'locationId' = '${
        event.locationId
      }'`;
      let appointments = await rsRepository.query(selectSql);
      return appointments.map(appointment =>
        Object.extend({}, appointment, { location: event.name }),
      );
    };

    const locationAdded = async event => {
      innerState.locations.push({
        name: event.name,
        locationId: event.locationId,
      });
    };

    return metaLogger(
      {
        innerState,
        appointmentScheduled,
        appointmentUpdated,
        trainerPaid,
        trainerInfoUpdated,
        locationUpdated,
        locationAdded,
        appointmentCompleted,
      },
      'unpaidAppointmentState',
    );
  };
};
