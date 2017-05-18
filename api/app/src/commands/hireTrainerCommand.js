module.exports = function(invariant) {
  return function (trainer) {
    invariant(trainer.contact.firstName, 'hireTrainer requires that you pass the trainers first name');
    invariant(trainer.contact.lastName, 'hireTrainer requires that you pass the trainers last name');
    invariant(trainer.contact.email, 'hireTrainer requires that you pass the trainers email');
    invariant(trainer.contact.mobilePhone, 'hireTrainer requires that you pass the trainers mobilePhone');
    invariant(trainer.credentials.password, 'hireTrainer requires that you pass the trainers password');
    invariant(trainer.credentials.role, 'hireTrainer requires that you pass the trainers role');
    return trainer;
  };
};