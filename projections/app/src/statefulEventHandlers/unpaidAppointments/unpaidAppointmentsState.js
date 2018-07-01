module.exports = function(invariant, R, logger, metaLogger) {
  return function UnpaidAppointments(innerState) {
    // internal methods
    const cleanUp = event => {
      // remove paid appointments
      const appointmentIds = event.paidAppointments.map(x => x.appointmentId);
      innerState.appointments = innerState.appointments.filter(
        x => !appointmentIds.includes(x.appointmentId),
      );

      const purchaseIds = R.uniqBy(x => x.purchaseId, innerState.sessions).map(
        x => x.purchaseId,
      );
      purchaseIds.forEach(x => {
        if (
          innerState.sessions
            .filter(s => s.purchaseId === x)
            .every(s => s.trainerPaid || s.refunded)
        ) {
          // remove sessions when the entire purchase is used
          innerState.sessions = innerState.sessions.filter(
            s => s.purchaseId !== x,
          );
        }
      });
    };

    // from processAttendedUnfundedAppointment
    const createUnfundedAppointment = (appointment, event) => {
      let client = innerState.clients.find(c => c.clientId === event.clientId);
      let trainer = innerState.trainers.find(
        x => x.trainerId === appointment.trainerId,
      );
      return {
        trainerId: trainer.trainerId,
        clientId: event.clientId,
        clientName: `${client.lastName}, ${client.firstName}`,
        appointmentId: appointment.appointmentId,
        appointmentDate: appointment.date,
        appointmentStartTime: appointment.startTime,
        appointmentType: event.appointmentType,
      };
    };

    // from fundedAppointmentAttendedByClient
    const createUnpaidAppointment = (appointment, event) => {
      let client = innerState.clients.find(c => c.clientId === event.clientId);
      let session = innerState.sessions.find(
        s => s.sessionId === event.sessionId,
      );

      let trainer = innerState.trainers.find(
        x => x.trainerId === appointment.trainerId,
      );

      let TCR = trainer.TCRS.find(tcr => tcr.clientId === client.clientId);
      let TR = 0;
      if (session && TCR) {
        TR = session.purchasePrice * (TCR.rate * 0.01);
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
        verified: false,
      };
    };

    const calculateTrainerRateAndPay = (trainerId, clientId, sessionPrice) => {
      let trainer = innerState.trainers.find(x => x.trainerId === trainerId);
      let TCR = trainer.TCRS.find(tcr => tcr.clientId === clientId);
      let TR = TCR ? sessionPrice * (TCR.rate * 0.01) : 0;

      //probably set this to default TCR if 0
      return { rate: TCR ? TCR.rate : 0, pay: TR };
    };

    // from unfundedAppointmentFundedByClient or removeFundedAppointment
    const fundUnfundedAppointment = (event, trainerId) => {
      const unfunded = innerState.unfundedAppointments.find(
        x =>
          x.appointmentId === event.appointmentId &&
          x.clientId === event.clientId,
      );
      const trainerRateAndPay = calculateTrainerRateAndPay(
        trainerId,
        event.clientId,
        event.purchasePrice,
      );
      let funded = Object.assign({}, unfunded, {
        sessionId: event.sessionId,
        pricePerSession: event.purchasePrice,
        trainerPercentage: trainerRateAndPay.rate,
        trainerPay: trainerRateAndPay.pay,
        verified: false,
      });

      innerState.unpaidAppointments.push(funded);
      innerState.unfundedAppointments = innerState.unfundedAppointments.filter(
        x =>
          !(
            x.appointmentId === event.appointmentId &&
            x.clientId === event.clientId
          ),
      );
    };

    // both fundedAppointmentRemovedForClient and sessionReturnedFromPastAppointment
    // call this. they are both always emtted together. But they both need to update different stuff
    // elsewhere.  but I'm afraid that if I remove this for one of them things will change and this
    // wont be updated. maybe they should be combined into one event.
    const removeFundedAppointment = event => {
      let unpaidAppointment = innerState.unpaidAppointments.find(
        x =>
          x.appointmentId === event.appointmentId &&
          x.clientId === event.clientId,
      );

      if (!unpaidAppointment || unpaidAppointment.length <= 0) {
        return undefined;
      }

      innerState.unpaidAppointments = innerState.unpaidAppointments.filter(
        x =>
          !(
            x.appointmentId === event.appointmentId &&
            x.clientId === event.clientId
          ),
      );

      return unpaidAppointment.trainerId;
    };

    // external methods
    // someone attended an appointment and had a session

    //TODO ok for updated appt client we can create
    //TODO the new appointment but because there is no unfunded one I can't get teh trainerId
    //TODO and the whole thing doesn't get persisted
    const fundedAppointmentAttendedByClient = event => {
      // first we create new unpaid appointment
      const appointment = innerState.appointments.find(
        x => x.appointmentId === event.appointmentId,
      );
      innerState.unpaidAppointments.push(
        createUnpaidAppointment(appointment, event),
      );
      return appointment.trainerId;
    };

    const fundedAppointmentRemovedForClient = event => {
      return removeFundedAppointment(event);
    };

    const updateAppointmentMap = (appointment, event) => {
      const result =
        appointment.appointmentId === event.appointmentId
          ? Object.assign({}, appointment, {
              trainerId: event.trainerId,
              startTime: event.startTime,
              endTime: event.endTime,
              notes: event.notes,
            })
          : appointment;
      if (event.oldTrainerId && event.oldTrainerId !== event.trainerId) {
        const trainerRateAndPay = calculateTrainerRateAndPay(
          event.trainerId,
          appointment.clientId,
          appointment.pricePerSession,
        );
        result.trainerPercentage = trainerRateAndPay.rate;
        result.trainerPay = trainerRateAndPay.pay;
      }
      return result;
    };

    // man this is ass ugly I hope at least it fucking works
    const pastAppointmentUpdated = event => {
      // this prop should be renamed updatedWithNoSideEffects
      if (event.updateDayOnly) {
        innerState.unfundedAppointments = innerState.unfundedAppointments.map(
          x => updateAppointmentMap(x, event),
        );
        innerState.unpaidAppointments = innerState.unpaidAppointments.map(x =>
          updateAppointmentMap(x, event),
        );
        return event.trainerId;
      }
      return undefined;
    };

    const sessionReturnedFromPastAppointment = event => {
      return removeFundedAppointment(event);
    };

    const trainerPaid = event => {
      innerState.unpaidAppointments = innerState.unpaidAppointments.filter(
        x => !event.paidAppointments.some(y => x.sessionId === y.sessionId),
      );
      cleanUp(event);
    };

    const transferSession = event => {
      let unfundedAppointment = innerState.unfundedAppointments.find(
        x => x.appointmentId === event.appointmentId,
      );
      if (!unfundedAppointment) {
        return undefined;
      }
      const session = innerState.sessions.find(
        x => x.sessionId === event.sessionId,
      );
      // a bit weird but were piggy backing on fundUnfundedAppointment
      const updatedEvent = Object.assign({}, event, {
        purchasePrice: session.purchasePrice,
      });
      fundUnfundedAppointment(updatedEvent, unfundedAppointment.trainerId);

      return unfundedAppointment.trainerId;
    };

    const unfundedAppointmentAttendedByClient = event => {
      let appointment = innerState.appointments.find(
        x => x.appointmentId === event.appointmentId,
      );
      if (!appointment || appointment.length <= 0) {
        return undefined;
      }

      // create new unfunded appointment
      innerState.unfundedAppointments.push(
        createUnfundedAppointment(appointment, event),
      );
      return appointment.trainerId;
    };

    // someone bought a session
    const unfundedAppointmentFundedByClient = event => {
      let appointment = innerState.appointments.find(
        x => x.appointmentId === event.appointmentId,
      );
      if (!appointment || appointment.length <= 0) {
        return undefined;
      }
      fundUnfundedAppointment(event, appointment.trainerId);

      return appointment.trainerId;
    };

    const unfundedAppointmentRemovedForClient = event => {
      innerState.unfundedAppointments = innerState.unfundedAppointments
        // this was a bit tricky because there were two conditions you can't do the negative
        .filter(
          x =>
            !(
              x.appointmentId === event.appointmentId &&
              x.clientId === event.clientId
            ),
        );

      return event.trainerId;
    };

    return metaLogger(
      {
        innerState,
        fundedAppointmentAttendedByClient,
        fundedAppointmentRemovedForClient,
        pastAppointmentUpdated,
        sessionReturnedFromPastAppointment,
        trainerPaid,
        transferSession,
        unfundedAppointmentAttendedByClient,
        unfundedAppointmentFundedByClient,
        unfundedAppointmentRemovedForClient,
      },
      'unpaidAppointmentState',
    );
  };
};
