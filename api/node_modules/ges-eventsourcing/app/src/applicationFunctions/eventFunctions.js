
module.exports = function(R, uuid, functionalHelpers){
  var fh = functionalHelpers;
  var parseMetadata = R.compose(R.chain(fh.safeParseBuffer), R.chain(fh.safeProp('metadata')), fh.safeProp('event'));
  var parseData = R.compose(R.chain(fh.safeParseBuffer), R.chain(fh.safeProp('data')), fh.safeProp('event'));

  return {
    parseMetadata,
    parseData
  }
};