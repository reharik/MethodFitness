module.exports = function(invariant) {
  return function (purchase) {
    invariant(purchase.clientId, 'purchases requires that you pass the clients Id');
    return purchase
  }
};