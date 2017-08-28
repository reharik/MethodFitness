module.exports = function(invariant) {
  return function({clientId,
                    unarchivedDate}) {
    invariant(clientId, 'clientUnarchived requires that you pass the clients id');
    invariant(unarchivedDate, 'clientUnarchived requires that you pass the date');
    return {
      eventName: 'clientUnarchived',
      clientId,
      unarchivedDate};
  };
};
