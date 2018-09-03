module.exports = function(invariant) {
  return state => {
    return {
      expectNotArchived: () => {
        invariant(!state._isArchived, 'Location already archived');
      },

      expectArchived: () => {
        invariant(state._isArchived, 'Location is not archived archived');
      },
    };
  };
};
