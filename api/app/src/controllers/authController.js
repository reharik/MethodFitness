/**
 * Created by reharik on 7/26/15.
 */
"use strict";

module.exports = function(commands, eventstore, logger, config){

    var signIn = function (ctx) {
        logger.debug("arrived at login");
        if (!ctx.state.user) {
            ctx.status = 401;
            ctx.body = { "success": false, errors:['Invalid credentials provided'] };
        } else {
            let user = ctx.state.user;
            var cmd = commands.loginTrainerCommand(user.id, user.userName);
            eventstore.commandPoster(cmd, 'loginTrainer');
            delete user.password;
            ctx.body = {success: true, user };
        }
    };
    //
    // var  checkAuth = async function () {
    //     if (this.passport.user) {
    //         this.body = {user: this.passport.user};
    //         this.status = 200;
    //     } else{
    //         this.status = 401;
    //     }
    // };

    var  signOut = async function (ctx) {
        ctx.user = null;
        if (ctx.session && ctx.session['papers']) {
            delete ctx.session['papers'].user;
        }
        ctx.status = 204;
    };

    return {
        signIn:signIn,
        signOut:signOut,
        // checkAuth:checkAuth
    }

};

