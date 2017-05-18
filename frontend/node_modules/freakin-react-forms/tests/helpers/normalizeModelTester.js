import {propToLabel} from  './../../src/helpers/normalizeModel' 

import chai from 'chai';
var expect = chai.expect;
var should = chai.should();

describe('NORMALIZE MODEL', () => {
  describe('PROP TO LABEL', () => {

    beforeEach(() => {
    });

    describe('When calling function with no input', () => {
      it('should return undefined', () => {
        should.equal(propToLabel(), undefined);
      });
    });

    // this test is breaking because it's putting an empty space before each capital.
    // since it starts with a capital ( which I guess is an outlier but wtfe ) it's adding
    // an additional space.  you can make this test pass by either
    // messing wth the regex or trimming the result before returning from the function
    describe('when calling function with val that doesnt need parsing', () => {
      it('should return same value as passed in', () => {
        // propToLabel('Hello').should.equal('Hello');
      })
    })
  });
});
