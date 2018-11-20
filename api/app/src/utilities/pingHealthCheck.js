module.exports = function(rsRepository, asyncretry, pingDB) {
  const ping = async function(healthCheckId, bail, number) {
    rsRepository = await rsRepository;
    console.log('attempt to connect to retrieve health check number', number);
    const result = await rsRepository.saveQuery(
      `select * from "healthcheck" where "id" ='${healthCheckId}'`,
    );

    if (result.rows.length === 0) {
      throw new Error(`row doesn't exist`);
    }
    return result.rows[0].healthcheck;
  };

  return async healthCheckId => {
    await pingDB();
    console.log(`=========="here"==========`);
    console.log('here');
    console.log(`==========END "here"==========`);

    return asyncretry((bail, number) => ping(healthCheckId, bail, number), {
      retries: 5,
    });
  };
};
