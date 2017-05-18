
module.exports = function(eventstore, uuid) {
  return async function (success, event, result, exception) {
    var data = {
      success: success === 'Success',
      initialEvent: event,
      handlerResult: result
    };
    if (!data.success) {
      data.exception = exception;
    }
    var metadata = {
      continuationId: event.continuationId || null,
      eventName: 'notification',
      streamType: 'notification'
    };

    var notification = eventstore.createJsonEventData(uuid.v4(), data, metadata, 'notification');

    await eventstore.gesConnection.appendToStream(
      'notification',
      eventstore.expectedVersion.any,
      [notification],
      eventstore.credentials);
  }
};