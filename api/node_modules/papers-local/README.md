[![Build Status](https://travis-ci.org/reharik/papers-local.svg?branch=master)](https://travis-ci.org/reharik/papers-local)
[![Code Climate](https://codeclimate.com/github/reharik/papers-local/badges/gpa.svg)](https://codeclimate.com/github/reharik/papers-local)
[![Test Coverage](https://codeclimate.com/github/reharik/papers-local/badges/coverage.svg)](https://codeclimate.com/github/reharik/papers-local/coverage)
[![Issue Count](https://codeclimate.com/github/reharik/papers-local/badges/issue_count.svg)](https://codeclimate.com/github/reharik/papers-local)
# papers-local

[papers](https://www.npmjs.com/package/papers) strategy for authenticating with a username
and password.

This module lets you authenticate using a username and password in your Node.js
applications.  By plugging into Papers, local authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).  This strategy also works with both [KOA](http://koajs.com/) and [KOA2](https://github.com/koajs/koa#koa-v2)

This module was ported from [passport-local](https://www.npmjs.com/package/passport-local) whose inspiration we greatly appreciate 

## Install

```bash
$ npm install papers-local
```

## Usage

#### Configure Strategy

The local authentication strategy authenticates users using a username and
password.  The strategy requires a `validate` function, which accepts these
credentials as well as passing in the request (ctx in KOA) and returns 
either a user, a falsy or throws an error.

```js
var localStrategy(
  function(username, password, req) {
    return User.findOne({ username: username }, function (err, user) {
      if (err) { return throw(err); }
      if (!user) { return false; }
      if (!user.verifyPassword(password)) { return (false); }
      return user;
    });
  }
));
```

##### Available Options

This strategy takes an optional options hash after the validate function, e.g. `localStrategy(validate, {/* options */})`.

The available options are:

* `usernameField` - Optional, defaults to 'username'
* `passwordField` - Optional, defaults to 'password'

Both fields define the name of the properties in the POST body that are sent to the server.

#### Parameters

By default, `LocalStrategy` expects to find credentials in parameters
named username and password. If your site prefers to name these fields
differently, options are available to change the defaults.

    localStrategy(function(username, password, req) {
        // ...
      }, {
        usernameField: 'email',
        passwordField: 'passwd'
      }
    );

#### Authenticate Requests
Use `papers().registerMiddleware(config)` specifying  your localStrategy in the strategies config.
```js
var papersConfig = {
  strategies: [ localStrategy ]
}
app.use(papers().registerMiddleware(config));
```
or for a specific endpoint
```js
app.post('/profile', papers().registerMiddleware(config),
    function(req, res) {
        res.send(req.user.profile);
    }
);
```

## Tests

```bash
$ npm install
$ npm test
```

## Credits

- Thank you to [Jared Hanson](http://github.com/jaredhanson) for passport, the inspiration for this library

## License

[The MIT License](http://opensource.org/licenses/MIT)
