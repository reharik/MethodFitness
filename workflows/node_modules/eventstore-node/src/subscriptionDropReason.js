const SubscriptionDropReason = {
  AccessDenied: 'accessDenied',
  CatchUpError: 'catchUpError',
  ConnectionClosed: 'connectionClosed',
  EventHandlerException: 'eventHandlerException',
  MaxSubscribersReached: 'maxSubscribersReached',
  NotFound: 'notFound',
  PersistentSubscriptionDeleted: 'persistentSubscriptionDeleted',
  ProcessingQueueOverflow: 'processingQueueOverflow',
  ServerError: 'serverError',
  SubscribingError: 'subscribingError',
  UserInitiated: 'userInitiated',
  Unknown: 'unknown'
};

module.exports = SubscriptionDropReason;