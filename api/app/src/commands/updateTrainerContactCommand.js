module.exports = function(invariant) {
  return function ({
    id,
    secondaryPhone,
    mobilePhone,
    email
  }) {
    invariant(id, 'updateTrainerContact requires that you pass the trainers id');
    invariant(email, 'updateTrainerContact requires that you pass the trainers email');
    invariant(mobilePhone, 'updateTrainerContact requires that you pass the trainers mobilePhone');
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