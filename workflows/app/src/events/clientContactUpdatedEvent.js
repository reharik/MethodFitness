module.exports = function(invariant) {
  return function({ clientId, contact, createdDate, createdById }) {
    const { secondaryPhone, mobilePhone, email } = contact;
    invariant(
      clientId,
      'clientContactUpdated requires that you pass the clients id',
    );
    invariant(
      email,
      'clientContactUpdated requires that you pass the clients email',
    );
    invariant(
      mobilePhone,
      'clientContactUpdated requires that you pass the clients mobilePhone',
    );
    return {
      eventName: 'clientContactUpdated',
      clientId,
      contact: {
        secondaryPhone,
        mobilePhone,
        email,
      },
      createdDate,
      createdById,
    };
  };
};
