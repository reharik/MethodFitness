module.exports = function(invariant) {
  return function({trainerId,
                    unarchivedDate}) {
    invariant(trainerId, 'trainerUnarchived requires that you pass the trainers id');
    invariant(unarchivedDate, 'trainerUnarchived requires that you pass the date');
    return {
      eventName: 'trainerUnarchived',
      trainerId,
      unarchivedDate};
  };
};
