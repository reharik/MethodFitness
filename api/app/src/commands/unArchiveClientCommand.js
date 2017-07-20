module.exports = function(invariant) {
  return function({ id }) {
    invariant(id, 'unArchiveClient requires that you pass the clients id');
    return { id };
  };
};
