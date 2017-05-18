/**
 * Created by rharik on 6/10/15.
 */
"use strict";

module.exports = function(eventstore, logger, appfuncs, invariant, uuid, extend, mapAndFilterStream ) {
  return function(_options) {
    var ef      = appfuncs.eventFunctions;
    var options = {
      readPageSize: 500,
      streamType  : 'event'
    };
    extend(options, _options || {});

    invariant(
      options.readPageSize,
      "repository requires a read size greater than 0"
    );

    var getById = async function(aggregateType, id) {
      var streamName;
      var aggregate;
      var sliceStart = 0;
      var currentSlice;
      var sliceCount;
      try {
        invariant(
          (aggregateType.isAggregateBase && aggregateType.isAggregateBase()),
          "aggregateType must inherit from AggregateBase"
        );

        invariant(id, "id must be a present");
        // invariant(
        //   (version >= 0),
        //   "version number must be greater than or equal to 0"
        // );

        streamName = `${aggregateType.aggregateName()}-${id}`;
        logger.debug(`Getting Aggregate by id with streamname: ${streamName}`);
        // this might be problematic
        aggregate = new aggregateType();


        // for (let i = 0; i < docs.length; i++) {
        //   let doc = docs[i];
        //   await db.post(doc);
        // }


        do {
          // specify number of events to pull. if number of events too large for one call use limit

          // sliceCount = sliceStart + options.readPageSize <= options.readPageSize ? options.readPageSize : version - sliceStart + 1;
          // get all events, or first batch of events from GES

          currentSlice = await eventstore.gesConnection.readStreamEventsForward(streamName,
            sliceStart,
            options.readPageSize,
            eventstore.credentials);

          //validate
          if (currentSlice.status == 'StreamNotFound') {
            throw new Error('Aggregate not found: ' + streamName);
          }
          //validate
          if (currentSlice.status == 'StreamDeleted') {
            throw new Error('Aggregate Deleted: ' + streamName);
          }

          var mAndF = mapAndFilterStream();

          sliceStart = currentSlice.nextEventNumber;
          currentSlice.events.forEach(e => {
            aggregate.applyEvent(mAndF.transformEvent(e).data)
          });

        } while (!currentSlice.isEndOfStream);
        logger.trace(`state of aggregate returning`);
        logger.trace(JSON.stringify(aggregate));

        return aggregate;
      } catch (err) {
        logger.error(`Error thrown by eventRepository 'getById' this may have been a check for existing aggregate.`);
        logger.error(err);
      }
    };

    var save = async function(aggregate, _metadata) {
      var streamName;
      var newEvents;
      var metadata;
      var originalVersion;
      var events;
      var appendData;
      var result;
      try {
        invariant(
          (aggregate.isAggregateBase && aggregate.isAggregateBase()),
          "aggregateType must inherit from AggregateBase"
        );
        // standard data for metadata portion of persisted event
        metadata = {
          // handy tracking id
          commitIdHeader: uuid.v4(),
          // type of aggregate being persisted
          aggregateTypeHeader: aggregate.constructor.name,
          // stream type
          streamType: options.streamType
        };

        // add extra data to metadata portion of persisted event
        metadata = extend(metadata, _metadata);
        streamName = `${aggregate.type}-${aggregate._id}`;
        newEvents = aggregate.getUncommittedEvents();
        originalVersion = aggregate._version - newEvents.length;
        logger.debug(`current aggregate version: ${aggregate._version}, original version: ${originalVersion}`);

        logger.trace(`appending ${JSON.stringify(newEvents)} to stream: ${streamName}`);

        events = newEvents.map(e=>
          eventstore.createJsonEventData(uuid.v4(), e, metadata, e.eventName || '')
        );

        await eventstore.gesConnection.appendToStream(streamName, originalVersion, events, eventstore.credentials);

        aggregate.clearUncommittedEvents();
      } catch (err) {
        logger.error(`Error thrown by event repository save`);
        logger.error(err);
        throw err;
      }
      //largely for testing purposes
      return events;
    };

    return {
      getById: getById,
      save   : save
    }
  };
};
