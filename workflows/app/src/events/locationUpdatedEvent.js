module.exports = function(invariant) {
  return function({ locationId, name }) {
    invariant(
      locationId,
      'locationUpdated requires that you pass the location id',
    );
    invariant(name, 'locationUpdated requires that you pass the location name');
    return {
      eventName: 'locationUpdated',
      locationId,
      name,
    };
  };
};
