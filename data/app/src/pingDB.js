module.exports = function(pg, config, promiseretry) {
  var ping = function () {
    const configs = config.configs.children.postgres.config;
    let dbExists;
    console.log(`==========configs=========`);
    console.log(configs);
    console.log(`==========END configs=========`);
    var client = new pg.Client(configs);
    return new Promise(function (res, rej) {
      // connect to our database
      return client.connect(function (err) {
        if (err) {
          console.log('==========err=========');
          console.log(err);
          console.log('==========END err=========');

          return rej(err);
        }
        // execute a query on our database
        client.query(`select relname as table from pg_stat_user_tables where schemaname = 'public'`,
          function (err, result) {
            if (err) {
              console.log('==========err=========');
              console.log(err);
              console.log('==========END err=========');

              return rej(err);
            }
            dbExists = !!result.rows[0];
            console.log('==========dbExists=========');
            console.log(dbExists);
            console.log('==========END dbExists=========');

            // disconnect the client
            client.end(function (err) {
              if (err) {
                console.log('==========err=========');
                console.log(err);
                console.log('==========END err=========');

                return rej(err);
              }
            });
            return res(dbExists);
          });
      });
    });
  };
  return () => {
    return promiseretry(function (retry, number) {
      console.log('attempt number', number);
      return ping().catch(retry);
    }, {retries: 4})
  };
};