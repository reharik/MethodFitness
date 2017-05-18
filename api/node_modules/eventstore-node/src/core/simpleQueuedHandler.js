function typeName(t) {
  if (typeof t === 'function')
    return t.name;
  if (typeof t === 'object')
    return t.constructor.name;
  throw new TypeError('type must be a function or object, not ' + typeof t);
}

function SimpleQueuedHandler() {
  this._handlers = {};
  this._messages = [];
  this._isProcessing = false;
}

SimpleQueuedHandler.prototype.registerHandler = function(type, handler) {
  var typeId = typeName(type);
  this._handlers[typeId] = function (msg) {
    try {
      handler(msg);
    } catch(e) {
      console.log('ERROR: ', e.stack);
    }
  };
};

SimpleQueuedHandler.prototype.enqueueMessage = function(msg) {
  this._messages.push(msg);
  if (!this._isProcessing) {
    this._isProcessing = true;
    setImmediate(this._processQueue.bind(this));
  }
};

SimpleQueuedHandler.prototype._processQueue = function() {
  var message = this._messages.shift();
  while(message) {
    var typeId = typeName(message);
    var handler = this._handlers[typeId];
    if (!handler)
        throw new Error("No handler registered for message " + typeId);
    setImmediate(handler, message);
    message = this._messages.shift();
  }
  this._isProcessing = false;
};

module.exports = SimpleQueuedHandler;