module.exports.metastreamOf = function(stream) {
  return '$$' + stream;
};
module.exports.isMetastream = function(stream) {
  return stream.indexOf('$$') === 0;
};