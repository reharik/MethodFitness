[![Build Status](https://travis-ci.org/reharik/koa-papers.svg?branch=master)](https://travis-ci.org/reharik/koa-papers)
[![Code Climate](https://codeclimate.com/github/reharik/koa-papers/badges/gpa.svg)](https://codeclimate.com/github/reharik/koa-papers)
[![Test Coverage](https://codeclimate.com/github/reharik/koa-papers/badges/coverage.svg)](https://codeclimate.com/github/reharik/koa-papers/coverage)
[![Issue Count](https://codeclimate.com/github/reharik/koa-papers/badges/issue_count.svg)](https://codeclimate.com/github/reharik/koa-papers)
# Papers

Papers is promise based authentication
middleware for [Node.js](http://nodejs.org/).

Papers authenticates requests through an
extensible set of plugins known as _strategies_.

Papers was inspired by the callback based authentication
system [Passport](http://passportjs.org/).
Feature parity is almost complete, except for a few minor items that I couldn't
figure out a use case for.

If there are any Passport features that are missing that you need
I would be happy to implement them.

## Why Papers
  - Not a fan of callbacks, and found passport logic very difficult to follow
  - I have also had a difficult time in the past figuring out/using Passport.
  - More functional style with less/no state if possible.  

## Key differences
  - Papers uses promises and co routines to handle the async or potentially async
  processes involved in authentication
  - Papers only extends the request with two functions (isAuthenticated and logout)
  and one property (user or whatever you set the userProperty to be).  It does not touch your strategies
  - Papers setup is different (simpler and more concise in my view).

## Install

```
$ npm install paper
```

## Usage

```javascript
var myStrategy = localStrategy(function(username, password) {
    // retrieve your user in some way.  
    // if you get an error or it fails to find user
    // return type: 'error' or type: 'fail'
    return {type: 'success', details: {user: user}};
));

var serializeUser = function(user) {
  return user.id;
});

var deserializeUser = function(id) {
  // retrieve your user again in someway
  return User.findById(id);
});

var papersConfig = {
  strategies: [ myStrategy ],
  useSession: true,
  serializers: [ serializeUser ],
  deserializers: [ deserializeUser ]
}

app.use(papers().registerMiddleware(config));
```

#### Strategies

Papers uses the concept of strategies to authenticate requests.  Strategies
can range from verifying username and password credentials, delegated
authentication using [OAuth](http://oauth.net/) (for example, via [Facebook](http://www.facebook.com/)
or [Twitter](http://twitter.com/)), or federated authentication using [OpenID](http://openid.net/).

Every strategy necessarily is different. You are responsible for supplying your chosen strategy(ies)
with what they need to authenticat.

The local strategy is the simplest and most familiar, it requires a function that takes a username and password.
Neither the strategy nor Papers could know how users are stored in your system.  So you must implement that verification.
But in the end, you either return an error, a failure, or a user.
In fact, all strategies ultimately will return either an error, a failure or a user.

Obviously a facebook or twitter strategy would require a bit more.  The strategy will tell you what it needs.  Once you setup your strategy you provide it to Papers the same way as any other strategy

Passport has 300+ strategies.  I have ported a few, it's quite easy.  Please find the ones you want at: [paperjs.org](http://paperjs.org)
and port them or ask me and I'll do it.

#### Sessions

Papers will maintain persistent login sessions.  In order for persistent
sessions to work, the authenticated user must be serialized to the session, and
deserialized when subsequent requests are made.

Papers does not impose any restrictions on how your user records are stored.
Instead, you provide functions to Papers which implement the necessary
serialization and deserialization logic.  In a typical application, this will be
as simple as serializing the user ID, and finding the user by ID when
deserializing.

```javascript
const serializeUser = function(user) {
  return user.id;
});

const deserializeUser = function(id) {
  return User.findById(id);
});
```

If your user object is small and serializable you could just keep it in session
```javascript
const serializeUser = function(user) {
  return user;
});

const deserializeUser = function(user) {
  return user;
});
```

#### Middleware

To use Papers in an [Express](http://expressjs.com/) or
[Connect](http://senchalabs.github.com/connect/)-based application, configure it
with at least the required proerties and functions.

```javascript
var app = express();
app.use(require('serve-static')(__dirname + '/../../public'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

const papersConfig = {
  strategies: [ myStrategy ],
  useSession: true,
  serializers: [ serializeUser ],
  deserializers: [ deserializeUser ]
}

app.use(papers().registerMiddleware(config));
```

#### Authenticate Requests

By calling registerMiddleware you have told express to apply your strategy(ies) to every request.
If you specify useSession to be true,  it will always check session first before trying to authenticate.
If you would like to only authenticate a certain route then instead of

```javascript
app.use(papers().registerMiddleware(config));
```
you would use

```javascript
app.post('/login',
  papers().registerMiddleware(config),
  function(req, res) {
    res.redirect('/');
  });
```

### Search Passport strategies and convert to use promises and/or async/await

There is a **Strategy Search** at [paperjs.org](http://paperjs.org)
Please feel free to port these to papers or ask me to do it.

## API

### papers.registerMiddleware(config={})

Produces middleware ready to provide to either app `app.use(...)`
or a route `app.post('/login', ..., (req,res)=> {}) `. 
Valid `config` keys include

- `strategies` (required) - [array] an array of one or more configured papers-strategies.
- `userProperty` (optional) - [string] default is 'user', you can provide your own key if you like.
- `failWithError` (optional) - [bool] default is 'false'.  If true if all strategies fail then it throws error rather than calling next with the errors.
- `failureRedirect` (optional) - [string] default is 'undefined'. If provided a url and all strategies fail, then you are redirected to said url.
- `successRedirect` (optional) - [string] default is 'undefined'. If provided a url and strategy succeeds, then you are redirected to said url.
- `useSession` (optional) - [bool] default is 'false'. specify whether you want to use session or not
	- If you set useSession to true, 
		- You must specify at least one serialize function and one deserialize function
		- You must also have enabled session in your express or koa app.
			- app.use(session());
- `serializers` (optional) - [array[functions]] default is '[]' . If using session you must provide at least one function that takes a `user` and returns a serialized value for putting in session.
- `deserializers` (optional) - [array[functions]] default is '[]' . if using session you must provide at least one function that takes a serialized `user` and returns a deserialized value for placing in request.
- `customHandler` (optional) - [function] default is 'undefined'. If provided, the custom handler is used ***instead of*** internal failure, success and error paths.
	- signature that is passed is all three cases is customHandler(request, respose, next, result)
		- request - connect request object
		- response - connect response object
		- next - middle ware next function, call to pass on to next middleware
		- result - the result of your strategy, either a failure message, a user in case of success or an error
			- `failure` -> `{type:'failure', details:{errorMessage: 'string', statusCode: someStatusCode, exception: exception if provided}}`
			- `error` -> `{type:'error', details:{errorMessage: 'string', statusCode: someStatusCode, exception: exception if provided}}`
			- `success` -> `{type:'success', details:{user:user}}`


## Different ways of using Papers

- Here is the most common and most basic set up.

```javascript

  const serializeUser = user => user.Id;

  const deserializeUser = id => {
    User.findById(id, function (err, user) {
      return user;
    });
  };

  // Here you must validate the creds based on your applications logic.
  // In this case we are using mongoose.
  var authLocalUser = (username, password) => {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return {type: 'error', details: {error: err}}; }
      if (!user) { return {type: 'fail', details: {error: 'message'}}; }
      if (!user.verifyPassword(password)) { return {type: 'fail', details: {error: 'invalid credentials'}}; }
      return {type: 'success', details: {user: user}};
    });
  }

  var local = paperslocal(authLocalUser);
  var config = {
      strategies: [local],
      useSession: true,
      serializers: [serializeUser],
      deserializers: [deserializeUser]
  };

  app.use(papers().registerMiddleware(config));

```

## Data Flow
 **Typical path**
  - your request comes in
    - we decorate request with "logOut" function and "isAuthenticated" function
      - logOut is a convience method that cleans up for you, with out your needing
      to go into Papers
      - isAuthenticated is another convience method to give you a quick status check
      - all other functionality is taken care of inside of papers
    - We check if you are using session and if so whether you are already logged in
    - If already logged in we put the user on the request and call the next middleware
    - If not useing session or not logged in we then iterate over your specified strategies
      - If your first strategy fails, we save the message and try the next
      - If all your strategies fail, the default behavior is to set a "www-authenicate" header with the accumulated errors
        and end response with a 401
      - If your strategy returns or throws an error we call the next middleware passing in the error.  This will be
        handled either by your error handling middleware or by your controller action
      - If your strategy returns a success then the user will be placed on the request and the next middleware will be called.
    - In some of those cases your request will land in your controller and you will be able to handle it however you like.
    - There are a couple of alternative paths you might want to use

  **Custom handling**
    alternatively you can provide a custom handler that deals with each state as it comes back

  - your request comes in
    - we decorate request with "logOut" function and "isAuthenticated" function
    - We check if you are using session and if so whether you are already logged in
    - If already logged in we put the user on the request and call the next middleware
    - If not useing session or not logged in we then iterate over your specified strategies
      - If your first strategy fails, we save the message and try the next
      - If all your strategies fail we call your custom handler with the following
        - Request, response, next, result
        - The result is the standard result format `{type: 'fail', details: { error: [collection of errors] }`
      - If your strategy returns or throws an error we call your custom handler with the following
        - request, response, next, result
        - The result is the standard result format `{type: 'error', details: { error: exception }`
      - If your strategy returns a success then the user will be placed on the request and we call your custom handler with the following
        - request, response, next, result
        - The result is the standard result format `{type: 'success', details: { user: user }`
    - It is the responsibility of your custom handler to either end the request or call the next middleware.
    - Essentially the custom handler acts as your controller action which can optionally proceed through the middleware or return short.

    ### Custom failure path
    - You can specify the following options in your papers config
      - failWithError : bool
      - failureRedirect: url (string)
    - Your request comes in and strategies all fails
      - failWithError is true
        - changes result from 'fail' to 'error' and is handled as such
      - failureRedirect is set
        - instead of directly returning with 401, it redirects to the provided url with 401

    ### Custom success
    - You can specify the following option in your papers config
      - successRedirect: url (string)
    - Your request comes in succeeds
      - successRedirect is set
        - instead of proceeding to next middleware and ultimately your controller action
        it places user on request and redirects to provided url

    ### Missing features
    - If there are any features that you are used to from passport but are missing here
    please let me know and I will implemnt them


## Tests

```
$ npm install
$ npm test
$ npm run intTests

```

## Credits

  - Thanks to [Jared Hanson](http://github.com/jaredhanson) for the inspiration

## License

[The MIT License](http://opensource.org/licenses/MIT)
