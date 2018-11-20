module.exports = function(
  eventstore,
  config,
  pingES,
  moment,
  commands,
  uuid,
  pingHealthCheck,
) {
  let heartBeat = async function(ctx) {
    ctx.body = `api is up ${moment().toString()}`;
    ctx.status = 200;
  };

  const systemsUp = async function(ctx) {
    console.log(`==========configs==========`);
    console.log(config.configs.children.eventstore);
    console.log(`==========END configs==========`);
    await pingES(config.configs.children.eventstore);
    let healthCheckId = uuid.v4();
    const command = commands.healthCheckCommand(healthCheckId);
    await eventstore.commandPoster(command, 'healthCheck', healthCheckId);
    let result;
    try {
      console.log(`==========healthCheckId==========`);
      console.log(healthCheckId);
      console.log(`==========END healthCheckId==========`);

      result = await pingHealthCheck(healthCheckId);
    } catch (ex) {
      ctx.body = `no response from end to end test`;
      ctx.status = 500;
      return ctx;
    }
    // if ping fails it throws, so 500
    ctx.body = `api is up ${moment(result).toString()}`;
    ctx.status = 200;
    return ctx;
  };

  return {
    heartBeat,
    systemsUp,
  };
};
