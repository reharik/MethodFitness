var ensure = require('../common/utils/ensure');

/**
 * @param {string} username
 * @param {string} password
 * @constructor
 * @property {string} username
 * @property {string} password
 */
function UserCredentials(username, password) {
  ensure.notNullOrEmpty(username, 'username');
  ensure.notNullOrEmpty(password, 'password');

  Object.defineProperties(this, {
    username: {enumerable: true, value: username},
    password: {enumerable: true, value: password}
  });
}

module.exports = UserCredentials;