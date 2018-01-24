module.exports = function(pingDB, config, dbmigrate) {
  return async function(runOnlyIfNoDB) {
    console.log(`=========="in migrator=========`);
    console.log("in migrator");
    console.log(`==========END "in migrator=========`);
    try {
      let dbExists;
      const configs = config.configs.children.postgres.config;

      try {
        console.log(`=========="pinging Db"=========`);
        console.log("pinging Db");
        console.log(`==========END "pinging Db"=========`);
        dbExists = await pingDB();

      } catch (err) {
        console.log(`=========="database not available"=========`);
        console.log("database not available");
        console.log(err);
        console.log(`==========END "database not available"=========`);
      }
      if (!runOnlyIfNoDB || (runOnlyIfNoDB && !dbExists)) {
        configs.driver = "pg";
        const migrator = dbmigrate.getInstance(true, {config: {dev: configs}, cwd: './app'});
        await migrator.reset();
        await migrator.up();
      } else {
        console.log('=========="db already exists"=========');
        console.log("db already exists");
        console.log('==========END "db already exists"=========');

      }
    } catch (ex) {
      console.log(`==========ex=========`);
      console.log(ex);
      console.log(`==========END ex=========`);
    }
    console.log(`=========="migrator complete"=========`);
    console.log("migrator complete");
    console.log(`==========END "migrator complete"=========`);
    // var pg = new pgasync.default(config.postgres.config);
    // // generate default data
    // var _data = data();

  };
};
