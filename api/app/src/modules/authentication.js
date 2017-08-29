module.exports = function(bcryptjs, rsRepository) {
  let createPassword = function(_password) {
    try {
      let salt = bcryptjs.genSaltSync(10);
      let hash = bcryptjs.hashSync(_password, salt);
      return hash;
    } catch (err) {
      throw err;
    }
  };

  let comparePassword = function(candidatePassword, realPassword) {
    return bcryptjs.compareSync(candidatePassword, realPassword);
  };

  let getClientsForTrainer = async user => {
    let trainer = await rsRepository.query(
      `select * from "trainer" where id = '${user.trainerId}'`
    );
    return trainer[0] ? Object.assign({}, user, {clients: trainer[0].clients}) : user;
  };

  let matchUser = async function(username, password) {
    let users = await rsRepository.query(
      `select * from "user" where not "archived" AND "document" ->> 'userName' = '${username.toLowerCase()}'`
    );
    //for now, but lets put a findOne func on repo
    let user = users[0];
    if (!user) {
      return null;
    }
    if (comparePassword(password, user.password)) {
      if (user.role !== 'admin') {
        user = await getClientsForTrainer(user);
      }

      return { user };
    }

    return null;
  };

  // var authenticate = function (ctx, next) {
  //     return
  // };

  return {
    createPassword,
    comparePassword,
    matchUser //,
    // authenticate: authenticate
  };
};
