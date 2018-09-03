module.exports = function(invariant) {
  return function({ locationId, name }) {
    invariant(
      locationId,
      'updateClientInfo requires that you pass the trainers id',
    );
    invariant(
      name,
      'updateClientInfo requires that you pass the trainers first name',
    );
    return {
      locationId,
      name,
    };
  };
};
