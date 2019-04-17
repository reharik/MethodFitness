module.exports = function(invariant) {
  return function({ locationId, name, legacyId, createdDate, createdById }) {
    invariant(name, 'locationAdded requires that you pass the location name');

    return {
      eventName: 'locationAdded',
      locationId,
      legacyId,
      name,
      createdDate,
      createdById,
    };
  };
};
