module.exports = function(invariant) {
  return function({ clientId, date }) {
    invariant(clientId, 'clientArchived requires that you pass the clients id');
    invariant(date, 'clientArchived requires that you pass the date');
    return {
      eventName: 'clientArchived',
      clientId,
      date,
    };
  };
};
