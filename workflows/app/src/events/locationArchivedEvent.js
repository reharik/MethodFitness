module.exports = function(invariant) {
  return function({ locationId, date }) {
    invariant(
      locationId,
      'locationArchived requires that you pass the locations id',
    );
    invariant(date, 'locationArchived requires that you pass the date');
    return {
      eventName: 'locationArchived',
      locationId,
      date,
    };
  };
};
