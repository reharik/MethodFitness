module.exports = function(invariant) {
  return function({id,
                    unarchivedDate}) {
    invariant(id, 'clientUnarchived requires that you pass the clients id');
    invariant(unarchivedDate, 'clientUnarchived requires that you pass the date');
    return {
      eventName: 'clientUnarchived',
      id,
      unarchivedDate};
  };
};
