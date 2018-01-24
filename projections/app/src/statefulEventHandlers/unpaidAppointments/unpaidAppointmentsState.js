module.exports = function(invariant, R, logger, metaLogger) {
  return function UnpaidAppointments(innerState) {
// internal methods
    const cleanUp = event => {
      // remove paid appointments
      const appointmentIds = event.paidAppointments.map(x => x.appointmentId);
      innerState.appointments = innerState.appointments.filter(x => !appointmentIds.includes(x.appointmentId));

      const purchaseIds = R.uniqBy(x => x.purchaseId, innerState.sessions).map(x => x.purchaseId);
      purchaseIds.forEach(x => {
        if (innerState.sessions.filter(s => s.purchaseId === x).every(s => s.trainerPaid || s.refunded)) {
          // remove sessions when the entire purchase is used
          innerState.sessions = innerState.sessions.filter(s => s.purchaseId !== x);
        }
      });

      console.log(`==========innerState.appointments=========`);
      console.log(innerState.appointments); // eslint-disable-line quotes
      console.log(`==========END innerState.appointments=========`);
    };

    // from processAttendedUnfundedAppointment
    const createUnfundedAppointment = (appointment, event) => {
      let client = innerState.clients.find(c => c.clientId === event.clientId);
      let trainer = innerState.trainers.find(x => x.trainerId === appointment.trainerId);
      return {
        trainerId: trainer.trainerId,
        clientId: client.clientId,
        clientName: `${client.lastName}, ${client.firstName}`,
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
        clientName: `${client.lastName}, ${client.firstName}`,
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
      const filterPredicate = clientId
        // this was a bit tricky because there were two conditions you can't do the negative
        ? x => !(x.appointmentId === appointmentId && x.clientId === clientId)
        : x => x.appointmentId !== appointmentId;

      const findPredicate = clientId
        ? x => x.appointmentId === appointmentId && x.clientId === clientId
        : x => x.appointmentId === appointmentId;

      let unfundedAppointment = innerState.unfundedAppointments.find(findPredicate);
      if (!unfundedAppointment || unfundedAppointment.length <= 0) {
        return undefined;
      }

      innerState.unfundedAppointments = innerState.unfundedAppointments.filter(filterPredicate);

      return unfundedAppointment.trainerId;
    };

// external methods
    // someone attended an appointment and had a session


    //TODO ok for updated appt client we can create
    //TODO the new appointment but because there is no unfunded one I can't get teh trainerId
    //TODO and the whole thing doesn't get persisted
    const fundedAppointmentAttendedByClient = event => {
      // first we create new unpaid appointment
      const appointment = innerState.appointments.find(x => x.appointmentId === event.appointmentId);
      innerState.unpaidAppointments.push(createUnpaidAppointment(appointment, event));
      return appointment.trainerId;
      // not sure why I was ever doing this but it was breaking for updateAppointment client change
      // then clean up previously processed unfunded appt
      // return removeUnfundedAppointment(event.appointmentId, event.clientId);
    };

    const fundedAppointmentRemovedForClient = event => {
      return removeFundedAppointment(event.appointmentId);
    };

    const updateAppointmentMap = (appointment, event) =>
      appointment.appointmentId === event.appointmentId
        ? Object.assign({}, appointment, {
          appointmentDate: event.date,
          appointmentStartTime: event.startTime
        })
        : appointment;

    // man this is ass ugly I hope at least it fucking works
    const pastAppointmentUpdated = event => {
      if (event.updateDayOnly) {
        innerState.unfundedAppointments = innerState.unfundedAppointments
          .map(x => updateAppointmentMap(x, event));
        innerState.unpaidAppointments = innerState.unpaidAppointments
          .map(x => updateAppointmentMap(x, event));
        return event.trainerId;
      }
      return undefined;
    };

    // this means either appointment client or type changed
    const sessionReturnedFromPastAppointment = event => {
      return removeFundedAppointment(event.appointmentId);
    };

    const trainerPaid = event => {
      innerState.unpaidAppointments = innerState.unpaidAppointments
        .filter(x => !event.paidAppointments.some(y => x.sessionId === y.sessionId));
      cleanUp(event);
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

    const unfundedAppointmentRemovedForClient = event => {
      return removeUnfundedAppointment(event.appointmentId);
    };

    return metaLogger({
      innerState,
      fundedAppointmentAttendedByClient,
      fundedAppointmentRemovedForClient,
      pastAppointmentUpdated,
      sessionReturnedFromPastAppointment,
      trainerPaid,
      transferSession,
      unfundedAppointmentAttendedByClient,
      unfundedAppointmentFundedByClient,
      unfundedAppointmentRemovedForClient
    }, 'unpaidAppointmentState');
  };
};
