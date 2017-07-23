module.exports = function(invariant) {
  return function({
                     id,
                     secondaryPhone,
                     mobilePhone,
                     email,
                    firstName,
                    lastName
                   }) {
    invariant(id, 'updateTrainerContact requires that you pass the trainers id');
    invariant(firstName, 'updateTrainerInfo requires that you pass the trainers first name');
    invariant(lastName, 'updateTrainerInfo requires that you pass the trainers last name');
    invariant(email, 'updateTrainerContact requires that you pass the trainers email');
    invariant(mobilePhone, 'updateTrainerContact requires that you pass the trainers mobilePhone');
    return {
      id,
      contact: {
        secondaryPhone,
        mobilePhone,
        email,
        firstName,
        lastName
      }
    };
  };
};
