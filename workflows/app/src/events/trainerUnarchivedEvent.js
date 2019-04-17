module.exports = function(invariant) {
  return function({ trainerId, date, createdDate, createdById }) {
    invariant(
      trainerId,
      'trainerUnarchived requires that you pass the trainers id',
    );
    invariant(date, 'trainerUnarchived requires that you pass the date');
    return {
      eventName: 'trainerUnarchived',
      trainerId,
      date,
      createdDate,
      createdById,
    };
  };
};
