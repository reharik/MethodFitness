module.exports = function(invariant) {
  return function({
                    id,
                   contact
                  }) {
    const {
      secondaryPhone,
      mobilePhone,
      email} = contact;
    invariant(id, 'clientContactUpdated requires that you pass the clients id');
    invariant(email, 'clientContactUpdated requires that you pass the clients email');
    invariant(mobilePhone, 'clientContactUpdated requires that you pass the clients mobilePhone');
    return {
      eventName: 'clientContactUpdated',
      id,
      contact: {
        secondaryPhone,
        mobilePhone,
        email
      }
    };
  };
};
