module.exports = function(pg, config, asyncretry) {
  const ping = async function(client, bail, number) {
    console.log(`=========="here"==========`);
    console.log('here');
    console.log(`==========END "here"==========`);

    console.log('attempt to connect to the db number', number);
    if (!client._connected()) {
      await client.connect();
    }

    client.on('error', err => {
      console.log(`==========err==asdfasdfdsaf========`);
      console.log(err);
      console.log(`==========END err==========`);
    });

    const result = await client.query(
      `select relname as table from pg_stat_user_tables where schemaname = 'public'`,
    );

    if (result.rowCount === 0) {
      throw new Error('db does not exist');
    }
    console.log('==========dbExists=========');
    console.log(true);
    console.log('==========END dbExists=========');
    await client.end();
    return client;
  };

  return () => {
    const configs = config.configs.children.postgres.config;
    console.log(`==========configs=========`);
    console.log(configs);
    console.log(`==========END configs=========`);
    const client = new pg.Client(configs);

    return asyncretry((bail, number) => ping(client, bail, number), {
      retries: 2,
    });
  };
};
