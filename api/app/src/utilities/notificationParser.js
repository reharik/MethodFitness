module.exports = function(logger) {
  return async notificationPromise => {
    let notification = await notificationPromise.stream;
console.log('==========notification=========');
console.log(notification);
console.log('==========END notification=========');

    const status = notification.success ? 200 : 422;
    let body = {};
    if (!notification.success) {
      body.success = false;
      body.exception = notification.exception;
      body.errors = notification.errors;
      body.message = notification.handlerResult;
      logger.error(notification.handlerResult);
    } else {
      body.success = notification.success;
      body.payload = notification.handlerResult;
    }
    console.log('==========subscription=========');
    console.log(subscription);
    console.log('==========END subscription=========');

    notificationPromise.subscription.stop();
    console.log('==========subscription=========');
    console.log(subscription);
    console.log('==========END subscription=========');

    return {
      body,
      status
    };
  };
};
