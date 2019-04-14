module.exports = function(invariant) {
  return function({refundSessions, clientId},
                  createdDate,
                  createdById
  ) {
    invariant(clientId, 'refundSessions requires that you pass the client id');
    invariant(refundSessions, 'refundSessions requires that you pass the session to refund');
    return {
      clientId,
      refundSessions,
      createdDate,
      createdById

    };
  };
};
