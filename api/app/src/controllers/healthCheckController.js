module.exports = function(eventstore, moment, commands, uuid, pingHealthCheck) {
  let heartBeat = async function(ctx) {
    ctx.body = `api is up ${moment().toString()}`;
    ctx.status = 200;
  };

  const systemsUp = async function(ctx) {
    let healthCheckId = uuid.v4();
    const command = commands.healthCheckCommand();
    await eventstore.commandPoster(command, 'healthCheck', healthCheckId);
    let result;
    try {
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
