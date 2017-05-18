module.exports = function(invariant) {
  return function (data) {
    invariant(data.id, 'unArchiveClient requires that you pass the clients id');
    return {id: data.id}
  }
};