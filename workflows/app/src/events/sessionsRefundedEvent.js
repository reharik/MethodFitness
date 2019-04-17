module.exports = function(invariant) {
  return function({ refundSessions, clientId, createdDate, createdById }) {
    invariant(
      clientId,
      'sessionsRefunded requires that you pass the client id',
    );
    invariant(
      refundSessions,
      'sessionsRefunded requires that you pass the session to refund',
    );
    return {
      eventName: 'sessionsRefunded',
      clientId,
      refundSessions,
      createdDate,
      createdById,
    };
  };
};
