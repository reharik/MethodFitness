module.exports = function functions(R, _fantasy, appfuncs, treis) {
    return function(_handlers) {
        var fh = appfuncs.functionalHelpers;
        var Left =_fantasy.Either.Left;
        var Right =_fantasy.Either.Right;

        //safeHandlers:: [JSON]-> Either<string,[JSON]>
        var safeHandlers =  R.or(R.isEmpty(_handlers), R.isNil(_handlers)) ? Left('Dispatcher requires at least one handler') : Right(_handlers);

        //matchName:: JSON -> bool
        var matchName = vent => R.chain(R.any(x=>x==vent.eventName));

        //matchHandler:: JSON -> (JSON -> bool)
        var matchHandler = vent => R.compose(R.map(matchName(vent),fh.safeProp('handlesEvents')));

        //filteredHandlers:: JSON -> [JSON]
        var filteredHandlers = x => safeHandlers.bimap(function(y) { throw new Error(y) }, R.filter(matchHandler(x)));

        //serveEventToHandlers:: JSON -> ()
        // can't compose because a=>a.handleEvent(x) is not curried
        var serveEventToHandlers = x=> filteredHandlers(x).map(R.map(a=> a.handleEvent(x)));

         return {
            safeHandlers,
            matchHandler,
            matchName,
            filteredHandlers,
            serveEventToHandlers
        }
    }
};
