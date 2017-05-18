const PersistentSubscriptionNakEventAction = {
  Unknown: 0,
  Park: 1,
  Retry: 2,
  Skip: 3,
  Stop: 4
};

module.exports = PersistentSubscriptionNakEventAction;
module.exports.isValid = function(value) {
  for(var k in PersistentSubscriptionNakEventAction)
    if (PersistentSubscriptionNakEventAction[k] === value) return true;
  return false;
};
