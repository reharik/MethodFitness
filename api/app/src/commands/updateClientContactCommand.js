module.exports = function(invariant) {
  return function ({
    id,
    secondaryPhone,
    mobilePhone,
    email
  }) {
    invariant(id, 'updateClientContact requires that you pass the clients id');
    invariant(email, 'updateClientContact requires that you pass the clients email');
    invariant(mobilePhone, 'updateClientContact requires that you pass the clients mobilePhone');
    return {
      id,
      contact: {
        secondaryPhone,
        mobilePhone,
        email
      }
    }
  }
};