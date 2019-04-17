module.exports = function(invariant) {
  return function({
                    clientId,
                     source,
                     sourceNotes,
                     startDate,
                    createdDate,
                    createdById
                  }) {
    invariant(clientId, 'updateClientSource requires that you pass the clients id');
    return {
      clientId,
      source,
      sourceNotes,
      startDate,
      createdDate,
      createdById
    };
  };
};
