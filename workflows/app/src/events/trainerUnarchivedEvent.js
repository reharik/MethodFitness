module.exports = function(invariant) {
  return function({ trainerId, date }) {
    invariant(
      trainerId,
      'trainerUnarchived requires that you pass the trainers id',
    );
    invariant(date, 'trainerUnarchived requires that you pass the date');
    return {
      eventName: 'trainerUnarchived',
      trainerId,
      date,
    };
  };
};
