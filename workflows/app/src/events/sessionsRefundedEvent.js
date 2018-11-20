module.exports = function(invariant) {
  return function({ refundSessions, clientId }) {
    console.log(`=========="here"==========`);
    console.log('here');
    console.log(`==========END "here"==========`);

    invariant(
      clientId,
      'sessionsRefunded requires that you pass the client id',
    );
    invariant(
      refundSessions,
      'sessionsRefunded requires that you pass the session to refund',
    );
    console.log(`=========="thereA"==========`);
    console.log(`=========="thereA"==========`);
    console.log('thereA');
    console.log(`==========END "thereA"==========`);

    return {
      eventName: 'sessionsRefunded',
      clientId,
      refundSessions,
    };
  };
};
