module.exports.notNullOrEmpty = function(value, name) {
  if (value === null)
    throw new TypeError(name + " should not be null.");
  if (value === '')
    throw new Error(name + " should not be empty.");
};

module.exports.notNull = function(value, name) {
  if (value === null)
    throw new TypeError(name + " should not be null.");
};

module.exports.isInteger = function(value, name) {
  if (typeof value !== 'number' || value % 1 !== 0)
    throw new TypeError(name + " should be an integer.");
};

module.exports.isArrayOf = function(expectedType, value, name) {
  if (!Array.isArray(value))
    throw new TypeError(name + " should be an array.");
  if (!value.every(function(x) { return x instanceof expectedType; }))
    throw new TypeError([name, " should be an array of ", expectedType.name, "."].join(""));
};

module.exports.isTypeOf = function(expectedType, value, name, nullAllowed) {
  if (nullAllowed && value === null) return;
  if (!(value instanceof expectedType))
    throw new TypeError([name, " should be of type '", expectedType.name, "'", nullAllowed ? " or null": "", "."].join(""));
};

module.exports.positive = function(value, name) {
  if (value <= 0)
    throw new Error(name + " should be positive.");
};

module.exports.nonNegative = function(value, name) {
  if (value < 0)
    throw new Error(name + " should be non-negative.");
};