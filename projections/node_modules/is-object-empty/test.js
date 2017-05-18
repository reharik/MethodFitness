var isObjectEmpty = require('./')
    , assert = require('assert');

assert.equal(isObjectEmpty({}), true);
assert.equal(isObjectEmpty({ key : 'val' }), false);
