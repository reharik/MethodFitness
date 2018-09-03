module.exports = (function(_options) {
  var options = {
    children: {
      mssql: {
        user: 'cannibalcoder',
        password: 'c@nn1b@l',
        server: 'cannibalserver8588.cloudapp.net',
        driver: 'tedious',
        database: 'MethodFitness_PROD',
      },
      eventstore: {
        host: 'localhost',
        http: 'http://localhost:2113',
        systemUsers: {
          admin: 'admin',
          adminPassword: 'changeit',
        },
      },
      postgres: {
        config: {
          user: 'methodfitness',
          database: 'methodfitness',
          host: 'localhost',
          password: 'password',
          port: '5400',
          max: '10',
          idleTimeoutMillis: '30000',
        },
      },
    },
  };
  const container = require('./registry')(options);
  const bootstrap = container.getInstanceOf('bootstrap');
  bootstrap().then(() => process.exit()); // eslint-disable-line no-process-exit
})();
