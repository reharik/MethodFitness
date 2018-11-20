module.exports = function(pg, pingDBStartUp, config, dbmigrate) {
  return async function(runOnlyIfNoDB) {
    console.log(`=========="in migrator=========`);
    console.log('in migrator');
    console.log(`==========END "in migrator=========`);
    try {
      let dbConnected;
      let dbExists;
      const configs = config.configs.children.postgres.config;

      try {
        console.log(`=========="pinging Db"=========`);
        console.log('pinging Db');
        console.log(`==========END "pinging Db"=========`);
        dbConnected = await pingDBStartUp();
      } catch (err) {
        console.log(`=========="database not available"=========`);
        console.log('database not available');
        console.log(err);
        console.log(`==========END "database not available"=========`);
      }

      const client = new pg.Client(configs);
      await client.connect();
      const results = await client.query(
        `select relname as table from pg_stat_user_tables where schemaname = 'public'`,
      );
      if (results.rowCount > 0) {
        dbExists = true;
      }

      if (!runOnlyIfNoDB || (runOnlyIfNoDB && !dbExists)) {
        configs.driver = 'pg';
        const migrator = dbmigrate.getInstance(true, {
          config: { dev: configs },
          cwd: './app',
        });
        await migrator.reset();
        await migrator.up();
      } else {
        console.log('=========="db already exists"=========');
        console.log('db already exists');
        console.log('==========END "db already exists"=========');
      }
    } catch (ex) {
      console.log(`==========ex=========`);
      console.log(ex);
      console.log(`==========END ex=========`);
    }
    console.log(`=========="migrator complete"=========`);
    console.log('migrator complete');
    console.log(`==========END "migrator complete"=========`);
    // var pg = new pgasync.default(config.postgres.config);
    // // generate default data
    // var _data = data();
  };
};
