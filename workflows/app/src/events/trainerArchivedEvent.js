module.exports = function(invariant) {
  return function({id,
                  archivedDate}) {
    invariant(id, 'trainerArchived requires that you pass the trainers id');
    invariant(archivedDate, 'trainerArchived requires that you pass the date');
    return {
      eventName: 'trainerArchived',
      id,
      archivedDate};
  };
};
