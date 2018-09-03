module.exports = function(invariant) {
  return function({ name, archived, legacyId }) {
    invariant(name, 'addLocation requires that you pass the locations name');

    return {
      name,
      archived,
      legacyId,
    };
  };
};
