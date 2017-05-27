module.exports = function(invariant) {
  return function(data) {
    invariant(data.clientId, 'cancelPurchaseDueToError requires that you pass the client id');
    invariant(data.id, 'cancelPurchaseDueToError requires that you pass the purchase id');
    return data;
  };
};
