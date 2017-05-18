function StaticEndpointDiscoverer(tcpEndPoint, useSsl) {
  this._nodeEndpoints = {
    tcpEndPoint: useSsl ? null : tcpEndPoint,
    secureTcpEndPoint: useSsl ? tcpEndPoint : null
  }
}

StaticEndpointDiscoverer.prototype.discover = function(failedTcpEndpoint) {
  return Promise.resolve(this._nodeEndpoints);
};

module.exports = StaticEndpointDiscoverer;