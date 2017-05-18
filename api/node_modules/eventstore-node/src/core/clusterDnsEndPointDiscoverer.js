var http = require('http');
var util = require('util');
var dns = require('dns');
var GossipSeed = require('../gossipSeed');

function NodeEndPoints(tcpEndPoint, secureTcpEndPoint) {
  if (tcpEndPoint === null && secureTcpEndPoint === null) throw new Error('Both endpoints are null.');
  Object.defineProperties(this, {
    tcpEndPoint: {
      enumerable: true,
      value: tcpEndPoint
    },
    secureTcpEndPoint: {
      enumerable: true,
      value: secureTcpEndPoint
    }
  });
}

function ClusterDnsEndPointDiscoverer(log, clusterDns, maxDiscoverAttempts, managerExternalHttpPort, gossipSeeds, gossipTimeout) {
  if (!clusterDns && (!gossipSeeds || gossipSeeds.length === 0)) throw new Error('Both clusterDns and gossipSeeds are null/empty.');
  this._log = log;
  this._clusterDns = clusterDns;
  this._maxDiscoverAttempts = maxDiscoverAttempts;
  this._managerExternalHttpPort = managerExternalHttpPort;
  this._gossipSeeds = gossipSeeds;
  this._gossipTimeout = gossipTimeout;
  this._oldGossip = null;
}

ClusterDnsEndPointDiscoverer.prototype.discover = function(failedTcpEndPoint) {
  var attempt = 1;
  var self = this;
  function discover(resolve, reject) {
    self._discoverEndPoint(failedTcpEndPoint)
      .then(function (endPoints) {
        if (!endPoints)
          self._log.info(util.format("Discovering attempt %d/%d failed: no candidate found.", attempt, self._maxDiscoverAttempts));
        return endPoints;
      })
      .catch(function (exc) {
        self._log.info(util.format("Discovering attempt %d/%d failed with error: %s.\n%s", attempt, self._maxDiscoverAttempts, exc, exc.stack));
      })
      .then(function (endPoints) {
        if (endPoints)
          return resolve(endPoints);
        if (attempt++ === self._maxDiscoverAttempts)
          return reject(new Error('Failed to discover candidate in ' + self._maxDiscoverAttempts + ' attempts.'));
        setTimeout(discover, 500, resolve, reject);
      });
  }
  return new Promise(function (resolve, reject) {
    discover(resolve, reject);
  });
};

/**
 * Discover Cluster endpoints
 * @param {Object} failedTcpEndPoint
 * @returns {Promise.<NodeEndPoints>}
 * @private
 */
ClusterDnsEndPointDiscoverer.prototype._discoverEndPoint = function (failedTcpEndPoint) {
  try {
    var mainPromise = this._oldGossip
      ? Promise.resolve(this._getGossipCandidatesFromOldGossip(this._oldGossip, failedTcpEndPoint))
      : this._getGossipCandidatesFromDns();
    var self = this;
    var j = 0;
    return mainPromise.then(function (gossipCandidates) {
      var loopPromise = Promise.resolve();
      for (var i = 0; i < gossipCandidates.length; i++) {
        loopPromise = loopPromise.then(function (endPoints) {
          if (endPoints) return endPoints;
          return self._tryGetGossipFrom(gossipCandidates[j++])
            .then(function (gossip) {
              if (!gossip || !gossip.members || gossip.members.length === 0)
                return;
              var bestNode = self._tryDetermineBestNode(gossip.members);
              if (bestNode) {
                self._oldGossip = gossip.members;
                return bestNode;
              }
            });
        });
      }
      return loopPromise;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

ClusterDnsEndPointDiscoverer.prototype._getGossipCandidatesFromOldGossip = function (oldGossip, failedTcpEndPoint) {
  if (!failedTcpEndPoint) return this._arrangeGossipCandidates(oldGossip);
  var gossipCandidates = oldGossip.filter(function(x) {
    return !(x.externalTcpPort === failedTcpEndPoint.port && x.externalTcpIp === failedTcpEndPoint.host);
  });
  return this._arrangeGossipCandidates(gossipCandidates);
};

ClusterDnsEndPointDiscoverer.prototype._arrangeGossipCandidates = function (members) {
  var result = new Array(members.length);
  var i = -1;
  var j = members.length;
  for (var k = 0; k < members.length; ++k)
  {
    if (members[k].state === 'Manager')
      result[--j] = new GossipSeed({host: members[k].externalHttpIp, port: members[k].externalHttpPort});
    else
      result[++i] = new GossipSeed({host: members[k].externalHttpIp, port: members[k].externalHttpPort});
  }
  this._randomShuffle(result, 0, i); // shuffle nodes
  this._randomShuffle(result, j, members.length - 1); // shuffle managers
  return result;
};

ClusterDnsEndPointDiscoverer.prototype._getGossipCandidatesFromDns = function () {
  var self = this;
  return new Promise(function (resolve, reject) {
    if (self._gossipSeeds && self._gossipSeeds.length > 0) {
      var endpoints = self._gossipSeeds;
      self._randomShuffle(endpoints, 0, endpoints.length - 1);
      resolve(endpoints);
    }
    else {
      const dnsOptions = {
        family: 4,
        hints: dns.ADDRCONFIG | dns.V4MAPPED,
        all: true
      };
      dns.lookup(self._clusterDns, dnsOptions, function (err, addresses) {
        if (err) {
          return reject(err);
        }
        if (!addresses || addresses.length === 0) {
          return reject(new Error('No result from dns lookup for ' + self._clusterDns));
        }
        var endpoints = addresses.map(function (x) {
          return new GossipSeed({host: x.address, port: self._managerExternalHttpPort});
        });
        resolve(endpoints);
      });
    }
  });
};

ClusterDnsEndPointDiscoverer.prototype._tryGetGossipFrom = function (endPoint) {
  var options = {
    host: endPoint.endPoint.host,
    port: endPoint.endPoint.port,
    path: '/gossip?format=json'
  };
  if (endPoint.hostHeader) {
    options.headers = {'Host': endPoint.hostHeader};
  }
  this._log.info('Try get gossip from', endPoint);
  var self = this;
  return new Promise(function (resolve, reject) {
    var timedout = false;
    http.request(options, function (res) {
          if (timedout) return;
          var result = '';
          if (res.statusCode !== 200) {
            self._log.info('Trying to get gossip from', endPoint, 'failed with status code:', res.statusCode);
            resolve();
            return;
          }
          res.on('data', function (chunk) {
            result += chunk.toString();
          });
          res.on('end', function () {
            try {
              result = JSON.parse(result);
            } catch (e) {
              return resolve();
            }
            resolve(result);
          });
        })
        .setTimeout(self._gossipTimeout, function () {
          self._log.info('Trying to get gossip from', endPoint, 'timed out.');
          timedout = true;
          resolve();
        })
        .on('error', function (e) {
          if (timedout) return;
          self._log.info('Trying to get gossip from', endPoint, 'failed with error:', e);
          resolve();
        })
        .end();
  });
};

const VNodeStates = {
  'Initializing': 0,
  'Unknown': 1,
  'PreReplica': 2,
  'CatchingUp': 3,
  'Clone': 4,
  'Slave': 5,
  'PreMaster': 6,
  'Master': 7,
  'Manager': 8,
  'ShuttingDown': 9,
  'Shutdown': 10
};

ClusterDnsEndPointDiscoverer.prototype._tryDetermineBestNode = function (members) {
  var notAllowedStates = [
    'Manager',
    'ShuttingDown',
    'Shutdown'
  ];
  var node = members
    .filter(function (x) {
      return (x.isAlive && notAllowedStates.indexOf(x.state) === -1);
    })
    .sort(function (a, b) {
      return VNodeStates[b.state] - VNodeStates[a.state];
    })[0];
  if (!node)
  {
    //_log.Info("Unable to locate suitable node. Gossip info:\n{0}.", string.Join("\n", members.Select(x => x.ToString())));
    return null;
  }

  var normTcp = {host: node.externalTcpIp, port: node.externalTcpPort};
  var secTcp = node.externalSecureTcpPort > 0
    ? {host: externalTcpIp, port: node.externalSecureTcpPort}
    : null;
  this._log.info(util.format("Discovering: found best choice [%j,%j] (%s).", normTcp, secTcp === null ? "n/a" : secTcp, node.state));
  return new NodeEndPoints(normTcp, secTcp);
};

function rndNext(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

ClusterDnsEndPointDiscoverer.prototype._randomShuffle = function (arr, i, j) {
  if (i >= j)
    return;
  for (var k = i; k <= j; ++k)
  {
    var index = rndNext(k, j + 1);
    var tmp = arr[index];
    arr[index] = arr[k];
    arr[k] = tmp;
  }
};

module.exports = ClusterDnsEndPointDiscoverer;