module.exports = function(invariant) {
  return function({id,
                    unarchivedDate}) {
    invariant(id, 'trainerUnarchived requires that you pass the trainers id');
    invariant(unarchivedDate, 'trainerUnarchived requires that you pass the date');
    return {
      eventName: 'trainerUnarchived',
      id,
      unarchivedDate};
  };
};
