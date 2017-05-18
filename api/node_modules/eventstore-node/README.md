# eventstore-node
A port of the EventStore .Net ClientAPI to Node.js

## Status

### Missing features:

- Ssl connection
- Set system settings

### Areas to improve

- Errors
  - Use codes or types to differentiate between errors
- Performance
  - Performance hasn't been tested yet
- Tests
  - Can always do with more tests

## Getting started

Install using `npm install eventstore-node`

### Dependencies

- Node.js >= 0.12
- Modules: [long](https://www.npmjs.org/package/long), [protobufjs](https://www.npmjs.org/package/protobufjs), [uuid](https://www.npmjs.org/package/uuid) (installed via `npm install`)

### API Documentation

#### Offline

The offline documentation can be found in the module folder `./node_modules/eventstore-node/docs`.

#### Online

The online documentation can be found at [https://dev.nicdex.com/eventstore-node/docs/](https://dev.nicdex.com/eventstore-node/docs/)

### Install & run an Eventstore on localhost

See http://docs.geteventstore.com/introduction/3.9.0/ . 
   
### Example: Storing an event

Save to ```app.js:```

```javascript
var esClient = require('eventstore-node');
var uuid = require('uuid');

var streamName = "testStream";
/* 
  Connecting to a single node using "tcp://localhost:1113"
  - to connect to a cluster via dns discovery use "discover://my.host:2113"
  - to connect to a cluster via gossip seeds use 
  [
    new esClient.GossipSeed({host: '192.168.1.10', port: 2113}), 
    new esClient.GossipSeed({host: '192.168.1.11', port: 2113}), 
    new esClient.GossipSeed({host: '192.168.1.12', port: 2113})
  ]
*/
var connSettings = {};  // Use defaults
var esConnection = esClient.createConnection(connSettings, "tcp://localhost:1113");
esConnection.connect();
esConnection.once('connected', function (tcpEndPoint) {
    console.log('Connected to eventstore at ' + tcpEndPoint.host + ":" + tcpEndPoint.port);
});

var eventId = uuid.v4();
var eventData = {
    a : Math.random(), 
    b: uuid.v4()
};
var event = esClient.createJsonEventData(eventId, eventData, null, 'testEvent');
console.log("Appending...");
esConnection.appendToStream(streamName, esClient.expectedVersion.any, event)
    .then(function(result) {
        console.log("Stored event:", eventId);
        console.log("Look for it at: http://localhost:2113/web/index.html#/streams/testStream");
        esConnection.close();
    })
    .catch(function(err) {
        console.log(err);
    });
```

Run:

```json
npm install uuid
npm install eventstore-node
node app.js
```

### Example: Subscribing to events

```cd samples```

To subscribe to all events from now on (includes example of a filter which ignores events which we aren't interested in):

```node subscribe-all-events.js```

To catch up on all events ever and subscribe to all new ones from now on:

```node subscribe-catchup-all-events.js```

To generate a test event, open a separate console and run:

```node store-event.js```

## Running the tests

To run the tests it is recommended that you use an in-memory instance of the eventstore so you don't pollute your dev instance.

    EventStore.ClusterNode.exe --memdb

To execute the tests suites simply run

    npm test

## Porting .Net Task to Node.js

Any async commands returns a [Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) object in replacement of .Net Task.  


## License

Ported code is released under the MIT license, see [LICENSE](https://github.com/nicdex/eventstore-node/blob/master/LICENSE). 
 
Original code is released under the EventStore license and can be found at https://github.com/eventstore/eventstore.
