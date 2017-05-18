/**
 * Created by reharik on 7/26/15.
 */
"use strict";

module.exports = function(bcryptjs) {

    var genSalt = function (rounds, ignore) {
        return new Promise(function (resolve, reject) {
            bcryptjs.genSalt(rounds, ignore, function (err, salt) {
                if (err) return reject(err);
                return resolve(salt);
            });
        });
    };

    var hash = function (data, salt) {
        return new Promise(function (resolve, reject) {
            bcryptjs.hash(data, salt, function (err, hash) {
                if (err) return reject(err);
                return resolve(hash);
            });
        });
    };

    var compare = function (data, hash) {
        return new Promise(function (resolve, reject) {
            bcryptjs.compare(data, hash, function (err, matched) {
                if (err) return reject(err);
                return resolve(matched);
            });
        });
    };

    return {
        genSalt:genSalt,
        hash:hash,
        compare:compare,
        // These do not need to be promisified
        genSaltSync: bcryptjs.genSaltSync,
        hashSync: bcryptjs.hashSync,
        compareSync: bcryptjs.compareSync,
        getRounds: bcryptjs.getRounds
    }
}