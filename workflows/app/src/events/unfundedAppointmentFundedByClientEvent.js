module.exports = function(invariant) {
  return function({
    appointmentDate,
    appointmentId,
    startTime,
    clientId,
    pricePerSession,
    purchaseId,
    sessionId,
    trainerId,
    trainerPay,
    trainerPercentage,
    createdDate,
    createdById,
  }) {
    invariant(
      appointmentId,
      'unfundedAppointmentFundedByClient requires that' +
        ' you pass the appointment id',
    );
    invariant(
      appointmentDate,
      'unfundedAppointmentFundedByClient requires that' +
        ' you pass the appointment date',
    );
    invariant(
      startTime,
      'unfundedAppointmentFundedByClient requires that' +
        ' you pass the appointment start time',
    );
    invariant(
      sessionId,
      'unfundedAppointmentFundedByClient requires that' +
        ' you pass the sessionId',
    );
    invariant(
      trainerId,
      'unfundedAppointmentFundedByClient requires that' +
        ' you pass the trainer Id',
    );
    invariant(
      clientId,
      'unfundedAppointmentFundedByClient requires that' +
        ' you pass the clientId',
    );
    invariant(
      purchaseId,
      'unfundedAppointmentFundedByClient requires that' +
        ' you pass the purchaseId',
    );
    invariant(
      pricePerSession,
      'unfundedAppointmentFundedByClient requires that' +
        ' you pass the price per session',
    );
    invariant(
      trainerPercentage,
      'unfundedAppointmentFundedByClient requires that' +
        ' you pass the trainer percentage',
    );
    invariant(
      trainerPay,
      'unfundedAppointmentFundedByClient requires that' +
        ' you pass the trainerPay',
    );

    return {
      eventName: 'unfundedAppointmentFundedByClient',
      appointmentDate,
      appointmentId,
      startTime,
      clientId,
      pricePerSession,
      purchaseId,
      sessionId,
      trainerId,
      trainerPay,
      trainerPercentage,
      createdDate,
      createdById,
    };
  };
};
