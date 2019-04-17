module.exports = function(invariant) {
  return function({ locationId, date, createdDate, createdById }) {
    invariant(
      locationId,
      'unArchiveLocation requires that you pass the locations id',
    );
    invariant(date, 'unArchiveLocation requires that you pass the date');
    return {
      locationId,
      date,
      createdDate,
      createdById,
    };
  };
};
