module.exports = function(pg, config, asyncretry) {
  const ping = async function(client, bail, number) {
    console.log('attempt to connect to the db number', number);
    console.log(`==========client==========`);
    console.log(client);
    console.log(`==========END client==========`);

    await client.connect();

    if (!client._connected) {
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
      retries: 10,
    });
  };
};
