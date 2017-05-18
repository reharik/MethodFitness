var papersLocal = require('papers-local');
var testStrategy = require('./../helpers/testStrategy');
var papers = require('./../../src/papers');

var basicSuccess = (app) => {

    var strategy = papersLocal(() => {
        return Promise.resolve({user: {name: 'bubba'}})
    });

    var papersConfig = {
        strategies: [strategy]
    };

    app.use(function *(next) {
        this.body = {username:'bubba', password:'likesit'};
        yield next;
    });

    return papers().registerMiddleware(papersConfig);
};

var basicFail = (app) => {

    var strategy = papersLocal(() => {
        return Promise.resolve();
    });

    var papersConfig = {
        strategies: [strategy]
    };

    app.use(function *(next) {
        this.body = {username:'bubba', password:'likesit'};
        yield next
    });

    return papers().registerMiddleware(papersConfig);
};

var pass = (app) => {

    var strategy = testStrategy({type:'pass'});

    var papersConfig = {
        strategies: [strategy]
    };

    return papers().registerMiddleware(papersConfig);
};


var redirect = (app) => {

    var strategy = testStrategy({type:'redirect', details: {url:'http://google.com'}});

    var papersConfig = {
        strategies: [strategy]
    };

    app.use(function *(next) {
        this.body = {username:'bubba', password:'likesit'};
        yield next
    });

    return papers().registerMiddleware(papersConfig);
};

var error = (app) => {

    var strategy = testStrategy({type:'error', details: {error: new Error("wtf! soemthing happened!")}});

    var papersConfig = {
        strategies: [strategy]
    };

    app.use(function *(next) {
        this.body = {username:'bubba', password:'likesit'};
        yield next
    });

    return papers().registerMiddleware(papersConfig);
};

var failTwice = () => {
    var strategy = testStrategy({type:'fail', details: {error: new Error("wtf! soemthing happened!")}});
    var strategy2 = testStrategy({type:'fail', details: {error: new Error("wtf! soemthing happened! again!!!"), statusCode:401}});

    var papersConfig = {
        strategies: [strategy, strategy2]
    };

    return papers().registerMiddleware(papersConfig);
};

var failWithError = () => {
    var strategy = testStrategy({type:'fail', details: {error: new Error("wtf! soemthing happened!")}});
    var strategy2 = testStrategy({type:'fail', details: {error: new Error("wtf! soemthing happened! again!!!"), statusCode:401}});

    var papersConfig = {
        strategies: [strategy, strategy2],
        failWithError: true
    };

    return papers().registerMiddleware(papersConfig);
};

var failureRedirect = () => {
    var strategy = testStrategy({type:'fail', details: {error: new Error("wtf! soemthing happened!")}});

    var papersConfig = {
        strategies: [strategy],
        failureRedirect: 'google.com'
    };

    return papers().registerMiddleware(papersConfig);
};

var customHandlerSuccess = () => {
    var strategy = testStrategy({type:'success', details: {user: {username:'bubba', password:'likesit'}}});

    var papersConfig = {
        strategies: [strategy],
        customHandler: function *(ctx, next, result) {
            ctx.request.customUser = result.details.user.username;
            yield next;
        }
    };
    return papers().registerMiddleware(papersConfig);
};

var customHandlerFailure = () => {
    var strategy = testStrategy({type: 'fail', details: {error:'too bad'}});

    var papersConfig = {
        strategies: [strategy],
        customHandler: (ctx, next, result) => {
            // yield next;
        }
    };
    return papers().registerMiddleware(papersConfig);
};

var customHandlerError = () => {
    var strategy = testStrategy({type: 'error', details: {error:'custom error'}});

    var papersConfig = {
        strategies: [strategy],
        customHandler: function (ctx, next, result) {
            ctx.status = 500;
        }
    };
    return papers().registerMiddleware(papersConfig);
};

module.exports = {
    basicSuccess,
    basicFail,
    pass,
    redirect,
    error,
    failTwice,
    failWithError,
    failureRedirect,
    customHandlerSuccess,
    customHandlerFailure,
    customHandlerError


};