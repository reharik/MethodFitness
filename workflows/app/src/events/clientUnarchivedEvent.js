module.exports = function(invariant) {
  return function({ clientId, date }) {
    invariant(
      clientId,
      'clientUnarchived requires that you pass the clients id',
    );
    invariant(date, 'clientUnarchived requires that you pass the date');
    return {
      eventName: 'clientUnarchived',
      clientId,
      date,
    };
  };
};
