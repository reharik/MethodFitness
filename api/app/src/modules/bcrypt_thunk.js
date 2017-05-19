/**
 * Created by reharik on 7/26/15.
 */


module.exports = function(bcryptjs) {
  let genSalt = function(rounds, ignore) {
    return new Promise(function(resolve, reject) {
      bcryptjs.genSalt(rounds, ignore, function(err, salt) {
        if (err) {return reject(err);}
        return resolve(salt);
      });
    });
  };

  let hash = function(data, salt) {
    return new Promise(function(resolve, reject) {
      bcryptjs.hash(data, salt, function(err, _hash) {
        if (err) {return reject(err);}
        return resolve(_hash);
      });
    });
  };

  let compare = function(data, _hash) {
    return new Promise(function(resolve, reject) {
      bcryptjs.compare(data, _hash, function(err, matched) {
        if (err) {return reject(err);}
        return resolve(matched);
      });
    });
  };

  return {
    genSalt,
    hash,
    compare,
    // These do not need to be promisified
    genSaltSync: bcryptjs.genSaltSync,
    hashSync: bcryptjs.hashSync,
    compareSync: bcryptjs.compareSync,
    getRounds: bcryptjs.getRounds
  };
};
