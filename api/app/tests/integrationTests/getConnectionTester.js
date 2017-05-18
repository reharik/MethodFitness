/**
 * Created by rharik on 6/10/15.
 */

require('must');

describe('gesConnection', function() {
    var gesConnection;
    var bootstrap;
    var mut;

    before(function(){
        bootstrap = require('../intTestBootstrap');
    });

    beforeEach(function(){
    });

    context('passing proper args', ()=> {
        it('should should return a connection', function () {
            mut = bootstrap.getInstanceOf('gesConnection');
            mut.must.not.be.null();
            mut._handler._connectingPhase.must.equal('Connected');
        })
    });

    //context('when calling subscription', ()=> {
    //    it('should stay open', function async (done) {
    //        mut = bootstrap.getInstanceOf('gesConnection')();
    //        var rx = bootstrap.getInstanceOf('rx');
    //        var subscription = mut.subscribeToAllFrom();
    //
    //        rx.Observable.fromEvent(subscription, 'event').take(10).forEach(x=> {console.log(x);}, err=>{throw err}, ()=>done());
    //
    //        mut._handler._connectingPhase.must.equal('Connected');
    //    })
    //});
});

