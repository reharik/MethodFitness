module.exports = function(invariant) {
  return function({ locationId, name, createdDate, createdById }) {
    invariant(
      locationId,
      'updateLocation requires that you pass the location id',
    );
    invariant(name, 'updateLocation requires that you pass the location name');
    return {
      locationId,
      name,
      createdDate,
      createdById,
    };
  };
};
