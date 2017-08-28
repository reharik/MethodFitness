module.exports = function(invariant) {
  return function({trainerId,
                  archivedDate}) {
    invariant(trainerId, 'trainerArchived requires that you pass the trainers id');
    invariant(archivedDate, 'trainerArchived requires that you pass the date');
    return {
      eventName: 'trainerArchived',
      trainerId,
      archivedDate};
  };
};
