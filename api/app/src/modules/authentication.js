"use strict";

module.exports = function(bcryptjs, rsRepository) {
    var createPassword = function (_password) {
        try {
            var salt = bcryptjs.genSaltSync(10);
            var hash = bcryptjs.hashSync(_password, salt);
            return hash;
        }
        catch (err) {
            throw err;
        }
    };

    var comparePassword = function (candidatePassword, realPassword) {
        return bcryptjs.compareSync(candidatePassword, realPassword);
    };

    var matchUser = async function (username, password, done) {
        var users = await rsRepository.query(`select * from "user" where not "archived" AND "document" ->> 'userName' = '${username.toLowerCase()}'`);
        //for now, but lets put a findOne func on repo
        var user = users[0];
        if (!user) {
            return null;
        }
        console.log(`==========comparePassword(password, user.password)=========`);
      console.log(password);
      console.log(comparePassword(password, user.password));
        console.log(`==========END comparePassword(password, user.password)=========`);
        if (comparePassword(password, user.password)) {
            return {user};
        }

        return null;
    };

    // var authenticate = function (ctx, next) {
    //     return 
    // };

    return {
        createPassword: createPassword,
        comparePassword: comparePassword,
        matchUser: matchUser//,
        // authenticate: authenticate
    };
};