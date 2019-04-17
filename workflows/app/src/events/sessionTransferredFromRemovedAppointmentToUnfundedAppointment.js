module.exports = function(invariant) {
  return function({
    appointmentId,
    clientId,
    sessionId,
    purchaseId,
    pricePerSession,
    trainerPercentage,
    trainerPay,
    trainerId,
    createdDate,
    createdById,
  }) {
    invariant(
      appointmentId,
      'sessionTransferredFromRemovedAppointmentToUnfundedAppointment requires that' +
        ' you pass the appointment id',
    );

    invariant(
      sessionId,
      'sessionTransferredFromRemovedAppointmentToUnfundedAppointment requires that' +
        ' you pass the sessionId',
    );
    invariant(
      clientId,
      'sessionTransferredFromRemovedAppointmentToUnfundedAppointment requires that' +
        ' you pass the clientId',
    );
    invariant(
      purchaseId,
      'sessionTransferredFromRemovedAppointmentToUnfundedAppointment requires that' +
        ' you pass the purchaseId',
    );
    invariant(
      pricePerSession,
      'sessionTransferredFromRemovedAppointmentToUnfundedAppointment requires that' +
        ' you pass the price per session',
    );
    invariant(
      trainerPercentage,
      'sessionTransferredFromRemovedAppointmentToUnfundedAppointment requires that' +
        ' you pass the trainer percentage',
    );
    invariant(
      trainerPay,
      'sessionTransferredFromRemovedAppointmentToUnfundedAppointment requires that' +
        ' you pass the trainerPay',
    );
    invariant(
      trainerId,
      'sessionTransferredFromRemovedAppointmentToUnfundedAppointment requires that' +
        ' you pass the trainer Id',
    );

    return {
      eventName:
        'sessionTransferredFromRemovedAppointmentToUnfundedAppointment',
      appointmentId,
      clientId,
      sessionId,
      purchaseId,
      pricePerSession,
      trainerPercentage,
      trainerPay,
      trainerId,
      createdDate,
      createdById,
    };
  };
};
