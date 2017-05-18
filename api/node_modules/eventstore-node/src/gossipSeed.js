module.exports = function GossipSeed(endPoint, hostName) {
  if (typeof endPoint !== 'object' || !endPoint.host || !endPoint.port) throw new TypeError('endPoint must be have host and port properties.');
  Object.defineProperties(this, {
    endPoint: {
      enumerable: true,
      value: endPoint
    },
    hostName: {
      enumerable: true,
      value: hostName
    }
  });
};
