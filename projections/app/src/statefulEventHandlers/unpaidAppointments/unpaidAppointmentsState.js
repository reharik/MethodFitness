module.exports = function(invariant, logger, metaLogger) {
  return function UnpaidAppointments(innerState) {
// internal methods
    // from processAttendedUnfundedAppointment
    const createUnfundedAppointment = (appointment, event) => {
      let client = innerState.clients.find(c => c.clientId === event.clientId);
      let trainer = innerState.trainers.find(x => x.trainerId === appointment.trainerId);
      return {
        trainerId: trainer.trainerId,
        clientId: client.clientId,
        clientName: `${client.firstName} ${client.lastName}`,
        appointmentId: appointment.appointmentId,
        appointmentDate: appointment.date,
        appointmentStartTime: appointment.startTime,
        appointmentType: appointment.appointmentType
      };
    };

    // from fundedAppointmentAttendedByClient
    const createUnpaidAppointment = (appointment, event) => {
      let client = innerState.clients.find(c => c.clientId === event.clientId);
      let session = innerState.sessions.find(s => s.sessionId === event.sessionId);

      let trainer = innerState.trainers.find(x => x.trainerId === appointment.trainerId);

      let TCR = trainer.TCRS.find(tcr => tcr.clientId === client.clientId);
      let TR = 0;
      if (session && TCR) {
        TR = session.purchasePrice * (TCR.rate * .01);
      }

      return {
        trainerId: trainer.trainerId,
        clientId: client.clientId,
        clientName: `${client.firstName} ${client.lastName}`,
        appointmentId: appointment.appointmentId,
        appointmentDate: appointment.date,
        appointmentStartTime: appointment.startTime,
        appointmentType: appointment.appointmentType,
        sessionId: session.sessionId,
        pricePerSession: session.purchasePrice,
        //possibly set this to default TCR if 0
        trainerPercentage: TCR ? TCR.rate : 0,
        trainerPay: TR,
        verified: false
      };
    };

    // from unfundedAppointmentFundedByClient or removeFundedAppointment
    const fundUnfundedAppointment = (event, trainerId) => {
      let unfunded = innerState.unfundedAppointments
        .find(x => x.appointmentId === event.appointmentId && x.clientId === event.clientId);
      let trainer = innerState.trainers.find(x => x.trainerId === trainerId);
      let TCR = trainer.TCRS.find(tcr => tcr.clientId === event.clientId);
      let TR = TCR ? event.purchasePrice * (TCR.rate * .01) : 0;
      unfunded.sessionId = event.sessionId;
      unfunded.pricePerSession = event.purchasePrice;
      //possibly set this to default TCR if 0
      unfunded.trainerPercentage = TCR ? TCR.rate : 0;
      unfunded.trainerPay = TR;
      unfunded.verified = false;
      return unfunded;
    };

    const removeFundedAppointment = appointmentId => {
      let unpaidAppointment = innerState.unpaidAppointments.find(x => x.appointmentId === appointmentId);
      if (!unpaidAppointment || unpaidAppointment.length <= 0) {
        return undefined;
      }

      innerState.unpaidAppointments = innerState.unpaidAppointments
        .filter(x => x.sessionId !== unpaidAppointment.sessionId);

      return unpaidAppointment.trainerId;
    };

    const removeUnfundedAppointment = (appointmentId, clientId) => {
      const predicate = clientId
        // this was a bit tricky because there were two conditions you can't do the negative
        ? x => !(x.appointmentId === appointmentId && x.clientId === clientId)
        : x => x.appointmentId !== appointmentId;
      innerState.unfundedAppointments = innerState.unfundedAppointments
        .filter(predicate);
    };

// external methods
    // someone attended an appointment and had a session
    const fundedAppointmentAttendedByClient = event => {
      let appointment = innerState.appointments.find(x => x.appointmentId === event.appointmentId);
      if (!appointment || appointment.length <= 0) {
        return undefined;
      }

      // first we create new unpaid appointment
      innerState.unpaidAppointments.push(createUnpaidAppointment(appointment, event));

      // then clean up previously processed unfunded appt
      removeUnfundedAppointment(event.appointmentId, event.clientId);
      return appointment.trainerId;
    };

    const pastAppointmentRemoved = appointmentId => {
      // first we have to find the appointment so we can get the trainer Id
      // but appointment already removed so look in processed appointments
      const trainerId = innerState
        .unpaidAppointments
        .filter(x => x.appointmentId === appointmentId)
        .map(x => x.trainerId);

      // try them both, they both check for null
      removeUnfundedAppointment(appointmentId);
      removeFundedAppointment(appointmentId);
      return trainerId;
    };

    const trainerPaid = event => {
      innerState.unpaidAppointments = innerState.unpaidAppointments
        .filter(x => !event.paidAppointments.some(y => x.sessionId === y.sessionId));
    };

    const transferSession = event => {
      let unfundedAppointment = innerState.unfundedAppointments.find(x => x.appointmentId === event.appointmentId);
      if (!unfundedAppointment) {
        return undefined;
      }
      const session = innerState.sessions.find(x => x.sessionId === event.sessionId);
      // a bit weird but were piggy backing on fundUnfundedAppointment
      const updatedEvent = Object.assign({}, event, { purchasePrice: session.purchasePrice });
      innerState.unpaidAppointments.push(fundUnfundedAppointment(updatedEvent, unfundedAppointment.trainerId));
      removeUnfundedAppointment(updatedEvent.appointmentId, updatedEvent.clientId);

      return unfundedAppointment.trainerId;
    };

    const unfundedAppointmentAttendedByClient = event => {
      let appointment = innerState.appointments.find(x => x.appointmentId === event.appointmentId);
      if (!appointment || appointment.length <= 0) {
        return undefined;
      }

      // create new unfunded appointment
      innerState.unfundedAppointments.push(createUnfundedAppointment(appointment, event));
      return appointment.trainerId;
    };

    // someone bought a session
    const unfundedAppointmentFundedByClient = event => {
      let appointment = innerState.appointments.find(x => x.appointmentId === event.appointmentId);
      if (!appointment || appointment.length <= 0) {
        return undefined;
      }

      innerState.unpaidAppointments.push(fundUnfundedAppointment(event, appointment.trainerId));
      removeUnfundedAppointment(event.appointmentId, event.clientId);

      return appointment.trainerId;
    };


    return metaLogger({
      innerState,
      fundedAppointmentAttendedByClient,
      pastAppointmentRemoved,
      trainerPaid,
      transferSession,
      unfundedAppointmentAttendedByClient,
      unfundedAppointmentFundedByClient
    }, 'unpaidAppointmentState');
  };
};
