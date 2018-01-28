module.exports = function() {
  let heartBeat = async function(ctx) {
    ctx.status = 200;
  };

  const systemsUp = async function(ctx) {
    ctx.status = 200;
  };

  return {
    heartBeat,
    systemsUp
  };
};
