/**
 * Created by reharik on 7/25/15.
 */


module.exports = function(authentication, paperslocal, koapapers) {
  let serialize = function(user) {
    return user;
  };

  let deserialize = function(user) {
    return user;
  };

  let authLocalUser = function(username, password) {
    return authentication.matchUser(username, password);
  };

  let local = paperslocal(authLocalUser, { usernameField: 'userName' });
  let config = {
    strategies: [local],
    useSession: true,
    serializers: [serialize],
    deserializers: [deserialize],
    whiteList: [{ url: '/swagger', method: 'GET' },
      { url: '/signout', method: 'POST' },
      { url: '/scheduledjobs/appointmentstatusupdate', method: 'POST' }]
  };

  return koapapers().registerMiddleware(config);
};
