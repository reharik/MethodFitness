module.exports = function(invariant) {
  return state => {
    return {
      expectNotArchived: () => {
        invariant(!state._isArchived, 'Client already archived');
      },

      expectArchived: () => {
        invariant(state._isArchived, 'Client is not archived archived');
      },

      expectSessionsExist: cmd => {
        invariant(state.clientInventory.sessionsExists(cmd), `Client does not have sessions with these Ids.
 It is possible that they have just been used, or there has been an error`);
      }
    };
  };
};
