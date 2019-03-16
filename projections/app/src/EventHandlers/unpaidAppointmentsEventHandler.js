module.exports = function(rsRepository, metaLogger, logger) {
  return async function unpaidAppointmentsEventHandler() {
    logger.info('unpaidAppointmentsEventHandler started up');

    const removeAppointments = async (trainerId, appointmentIds) => {
      rsRepository = await rsRepository;
      let trainer = await rsRepository.getById(trainerId, 'unpaidAppointments');
      trainer.appointments = trainer.appointments.filter(
        x => !appointmentIds.includes(x.appointmentId),
      );

      return await rsRepository.save('unpaidAppointments', trainer, trainerId);
    };

    async function fundedAppointmentAttendedByClient(event) {
      rsRepository = await rsRepository;
      let trainer = await rsRepository.getById(
        event.trainerId,
        'unpaidAppointments',
      );

      if (!trainer || Object.keys(trainer).length === 0) {
        trainer = {
          trainerId: event.trainerId,
          appointments: [],
        };
      }

      const appointment = Object.assign({}, event, {
        clientName: `${event.clientLastName}, ${event.clientFirstName}`,
        verified: false,
      });
      trainer.appointments.push(appointment);
      return await rsRepository.save(
        'unpaidAppointments',
        trainer,
        event.trainerId,
      );
    }

    async function unfundedAppointmentAttendedByClient(event) {
      return fundedAppointmentAttendedByClient(event);
    }

    async function fundedAppointmentRemovedForClient(event) {
      return removeAppointments(event.trainerId, [event.appointmentId]);
    }

    async function pastAppointmentUpdated(event) {
      rsRepository = await rsRepository;
      const updateAppointment = appt => {
        appt.trainerId = event.trainerId;
        appt.appointmentDate = event.startTime;
        appt.trainerPercentage =
          event.trainerPercentage || appt.trainerPercentage;
        appt.trainerPay = event.trainerPay || appt.trainerPay;
        return appt;
      };

      let trainer = await rsRepository.getById(
        event.trainerId,
        'unpaidAppointments',
      );
      if (!trainer || Object.keys(trainer).length === 0) {
        trainer = {
          trainerId: event.trainerId,
          appointments: [],
        };
      }

      let appointments;
      if (event.trainerChanged) {
        let previousTrainer = await rsRepository.getById(
          event.previousTrainerId,
          'unpaidAppointments',
        );
        appointments = previousTrainer.appointments.filter(
          x => x.appointmentId === event.appointmentId,
        );
        previousTrainer.appointments = previousTrainer.appointments.filter(
          x => x.appointmentId !== event.appointmentId,
        );
        appointments = appointments.map(x => updateAppointment(x));
        trainer.appointments = trainer.appointments.concat(appointments);

        await rsRepository.save(
          'unpaidAppointments',
          previousTrainer,
          event.previousTrainerId,
        );
      } else {
        appointments = trainer.appointments.filter(
          x => x.appointmentId !== event.appointmentId,
        );
        appointments.forEach(x => updateAppointment(x));
      }
      console.log(`==========JSON.stringify(trainer==========`);
      console.log(JSON.stringify(trainer));
      console.log(`==========END JSON.stringify(trainer==========`);

      return await rsRepository.save(
        'unpaidAppointments',
        trainer,
        event.trainerId,
      );
    }

    async function unfundedAppointmentFundedByClient(event) {
      rsRepository = await rsRepository;
      let trainer = await rsRepository.getById(
        event.trainerId,
        'unpaidAppointments',
      );
      let appointment = trainer.appointments.find(
        x =>
          x.appointmentId === event.appointmentId &&
          x.clientId === event.clientId,
      );

      appointment.pricePerSession = event.pricePerSession;
      appointment.purchaseId = event.purchaseId;
      appointment.sessionId = event.sessionId;
      appointment.trainerPay = event.trainerPay;
      appointment.trainerPercentage = event.trainerPercentage;

      return await rsRepository.save(
        'unpaidAppointments',
        trainer,
        event.trainerId,
      );
    }

    async function sessionTransferredFromRemovedAppointmentToUnfundedAppointment(
      event,
    ) {
      return unfundedAppointmentFundedByClient(event);
    }

    async function trainerPaid(event) {
      removeAppointments(
        event.trainerId,
        event.paidAppointments.map(x => x.appointmentId),
      );
    }

    async function unfundedAppointmentRemovedForClient(event) {
      removeAppointments(event.trainerId, [event.appointmentId]);
    }

    const trainerVerifiedAppointments = async event => {
      rsRepository = await rsRepository;
      let trainer = await rsRepository.getById(
        event.trainerId,
        'unpaidAppointments',
      );

      trainer.appointments = trainer.appointments.map(x => {
        if (event.sessionIds.includes(x.sessionId)) {
          x.verified = true;
          x.verfiedDate = event.verifiedDate;
        }
        return x;
      });
      return await rsRepository.save(
        'unpaidAppointments',
        trainer,
        event.trainerId,
      );
    };

    return metaLogger(
      {
        handlerName: 'unpaidAppointmentsEventHandler',
        fundedAppointmentAttendedByClient,
        fundedAppointmentRemovedForClient,
        pastAppointmentUpdated,
        sessionTransferredFromRemovedAppointmentToUnfundedAppointment,
        trainerPaid,
        unfundedAppointmentFundedByClient,
        unfundedAppointmentAttendedByClient,
        unfundedAppointmentRemovedForClient,
        trainerVerifiedAppointments,
      },
      'unpaidAppointmentsEventHandler',
    );
  };
};
