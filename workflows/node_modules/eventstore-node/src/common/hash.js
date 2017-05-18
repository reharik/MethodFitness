/**
 * @private
 * @constructor
 * @property {number} length
 */
function Hash() {
  this._ = {};
  this._length = 0;
}
Object.defineProperty(Hash.prototype, 'length', {
  get: function() {
    return this._length;
  }
});

Hash.prototype.add = function(key,value) {
  this._[key] = value;
  this._length++;
};

Hash.prototype.clear = function() {
  this._ = {};
  this._length = 0;
};

Hash.prototype.forEach = function(cb) {
  for(var k in this._) {
    cb(k, this._[k]);
  }
};

Hash.prototype.get = function(key) {
  return this._[key];
};

Hash.prototype.remove = function(key) {
  delete this._[key];
  this._length--;
};


module.exports = Hash;
