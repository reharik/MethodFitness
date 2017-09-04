module.exports = function(invariant) {
  return state => {
    return {
      expectCorrectPassword(password) {
        invariant(password === state._password, 'Incorrect credentials');
      },

      // expectNotLoggedIn() {
      //     invariant(!state._loggedIn, 'Trainer already logged in');
      // }

      expectNotArchived() {
        invariant(!state._isArchived, 'Trainer already archived');
      },

      expectArchived() {
        invariant(state._isArchived, 'Trainer is not archived archived');
      }
    };
  };
};
