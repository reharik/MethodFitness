module.exports = function(invariant) {
  return function({trainerId,
    date}) {
    invariant(trainerId, 'trainerArchived requires that you pass the trainers id');
    invariant(date, 'trainerArchived requires that you pass the date');
    return {
      eventName: 'trainerArchived',
      trainerId,
      date};
  };
};
