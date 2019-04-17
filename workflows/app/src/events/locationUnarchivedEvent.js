module.exports = function(invariant) {
  return function({ locationId, date, createdDate, createdById }) {
    invariant(
      locationId,
      'locationUnarchived requires that you pass the locations id',
    );
    invariant(date, 'locationUnarchived requires that you pass the date');
    return {
      eventName: 'locationUnarchived',
      locationId,
      date,
      createdDate,
      createdById,
    };
  };
};
