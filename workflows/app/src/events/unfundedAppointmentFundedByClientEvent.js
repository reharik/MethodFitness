module.exports = function(invariant) {
  return function({id,
                    clientId,
                    appointmentId,
                    appointmentType,
  sessionId,
  purchasePrice

}) {
    invariant(clientId, 'unfundedAppointmentFundedByClient requires that you pass the clients id');
    invariant(appointmentId, 'unfundedAppointmentFundedByClient requires that you pass the appointment id');
    invariant(appointmentType, 'unfundedAppointmentFundedByClient requires that you pass the appointment type');
    invariant(sessionId, 'unfundedAppointmentFundedByClient requires that you pass the session id');
    invariant(purchasePrice, 'unfundedAppointmentFundedByClient requires that you pass the purchase price');
    return {
      eventName: 'unfundedAppointmentFundedByClient',
      id,
      clientId,
      appointmentId,
      appointmentType,
      sessionId,
      purchasePrice
    };
  };
};
