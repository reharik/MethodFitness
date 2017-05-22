module.exports = function(pingDB, config, dbmigrate) {
  return async function () {
    console.log(`=========="in migrator=========`);
    console.log("in migrator");
    console.log(`==========END "in migrator=========`);
    try {
      const configs = config.configs.children.postgres.config;
      
      try { 
        console.log(`=========="pinging Db"=========`);
        console.log("pinging Db");
        console.log(`==========END "pinging Db"=========`);
        await pingDB();
      }catch (err){
        console.log(`=========="database not available"=========`);
        console.log("database not available");
        console.log(err);
        console.log(`==========END "database not available"=========`);
      }
      
      configs.driver = "pg";
      const migrator = dbmigrate.getInstance(true, {config: {dev: configs}, cwd:'./app' });
      await migrator.reset();
      await migrator.up();
    }catch(ex){
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
