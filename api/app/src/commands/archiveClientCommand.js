module.exports = function(invariant) {
  return function({id}) {
    invariant(id, 'archiveClient requires that you pass the clients id');
    return {id};
  };
};
