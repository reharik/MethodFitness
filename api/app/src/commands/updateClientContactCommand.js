module.exports = function(invariant) {
  return function({ clientId, secondaryPhone, mobilePhone, email }) {
    invariant(
      clientId,
      'updateClientContact requires that you pass the clients Id',
    );
    invariant(
      email,
      'updateClientContact requires that you pass the clients email',
    );
    invariant(
      mobilePhone,
      'updateClientContact requires that you pass the clients mobilePhone',
    );
    return {
      clientId,
      contact: {
        secondaryPhone,
        mobilePhone,
        email,
      },
    };
  };
};
