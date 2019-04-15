module.exports = (function(_options) {
  var options = {
      children: {
        mssql: {
          user: 'cannibalcoder',
          password: 'c@nn1b@lc0d3r',
          server: 'ec2-18-222-101-255.us-east-2.compute.amazonaws.com',
          driver: 'tedious',
          database: 'MethodFitness_PROD',
        },
        eventstore: {
          host: 'eventstore',
          maxRetries: 10,
          maxReconnections: 10,
          verbose: true,
          systemUsers: {
            admin: 'admin',
            adminPassword: 'changeit'
          },
          retries: {}
        },
        postgres: {
          config: {
            user: 'methodfitness',
            database: 'methodfitness',
            host: 'localhost',
            password: 'password',
            port: '5432'
          },
          retries: {}
        }
    },
  };
  const container = require('./registry')(options);
  const bootstrap = container.getInstanceOf('bootstrap');
  bootstrap().then(() => process.exit()); // eslint-disable-line no-process-exit
})();
