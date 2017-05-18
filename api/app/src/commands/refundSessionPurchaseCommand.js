module.exports = function(invariant) {
  return function (data) {
    invariant(data.clientId, 'refundPurchase requires that you pass the client id');
    invariant(data.id, 'refundPurchase requires that you pass the purchase id');
    return data;
  }
};