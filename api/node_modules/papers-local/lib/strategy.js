/**
 * Module dependencies.
 */
var util = require('util')
  , lookup = require('./utils').lookup;


/**
 * `Strategy` constructor.
 *
 * The local authentication strategy authenticates requests based on the
 * credentials submitted through an HTML-based login form.
 *
 * Applications must supply a `validate` callback which accepts `username` and
 * `password` credentials, and returns an object that has the form
 * { user: [the valid user],
 *   error: an error message}
 *
 * Optionally, `options` can be used to change the fields in which the
 * credentials are found.
 *
 * Options:
 *   - `usernameField`  field name where the username is found, defaults to _username_
 *   - `passwordField`  field name where the password is found, defaults to _password_
 *
 * Examples:
 *
 *     passport.use(new LocalStrategy(
 *       function(username, password) {
 *         User.findOne({ username: username, password: password }, function (err, user) {
 *           return {user, err}
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} validate
 * @api public
 */
function strategy(validate, options = {}) {
  if (!validate) {
    throw new TypeError('LocalStrategy requires a verify callback');
  }
  const _usernameField = options.usernameField || 'username';
  const _passwordField = options.passwordField || 'password';
  /**
   * Authenticate request based on the contents of a form submission.
   *
   * @param {Object} req
   * @api protected
   */
  const authenticate = function (req) {
    var username = lookup(req.body, _usernameField)
      || lookup(req.query, _usernameField)
      || lookup(req.request && req.request.body ? req.request.body : {}, _usernameField);
    var password = lookup(req.body, _passwordField)
      || lookup(req.query, _passwordField)
      || lookup(req.request && req.request.body ? req.request.body : {}, _passwordField);
   
    if (!username || !password) {
      return {type: 'fail', details: {error: 'Missing credentials', status: 400}};
    }

    try {
      return validate(username, password, req)
        .then((result) => {
          return result && result.user
            ? {type: 'success', details: {user: result.user}}
            : {
            type: 'fail', details: {error: result && result.error ? result.error : 'authentication failed'}
          };
        })

    } catch (ex) {
      return {type: 'fail', details: {error: ex.message, statusCode: 500, exception: ex}};
    }

  };
  return {
    authenticate,
    name: 'local'
  };
}
/**
 * Expose `Strategy`.
 */
module.exports = strategy;
