/**
 * Created by rharik on 11/1/15.
 */

module.exports = function(R, _fantasy, buffer, Promise, logger) {
    var Maybe           = _fantasy.Maybe;

    _fantasy.Future.prototype.then = function(res,rej){
        return this.fork(e => res(e), r => { res(r)})
    };

    var Future          = _fantasy.Future;

    Future.prototype.then = function(res,rej){
        return this.fork(e => res(e), r => { res(r)})
    };

    var safeProp        = R.curry((x, o) => o ? Maybe(o[x]) : Maybe.Nothing());

    var startsWith      = R.curry((x, s) => s.startsWith(x));

    var boolToMaybe     = x => x ? Maybe(x) : Maybe.Nothing();

    // var getSafeValue = (prop, src, _default) => {
    //     if(_default) {
    //         return safeProp(prop,src).getOrElse(_default);
    //     }
    //     return safeProp(prop, src).getOrElse();
    // };

    var getSafeValue = R.curry((prop, src) => safeProp(prop, src).getOrElse());

    // var futureToPromise = (future) => {
    //     return new Promise((resolve, reject) => future.fork(reject, resolve))
    // };

    var safeParseBuffer = x => buffer.Buffer.isBuffer(x) ? tryParseJSON(x.toString('utf8')) : Maybe.Nothing();

    var safeCreateBuffer = x => {
        var val = x.getOrElse('') || x;
        var buff = new buffer.Buffer(tryStringify(val).getOrElse(''));
        return buff ? Maybe.of(buff) : Maybe.Nothing();
    };

    var tryParseJSON = x => {
        try {
            return Maybe.of(JSON.parse(x));
        }
        catch (e) {
            return Maybe.Nothing();
        }
    };
    var tryStringify = x => {
        try {
            return Maybe.of(JSON.stringify(x));
        }
        catch (e) {
            return Maybe.Nothing();
        }
    };

    var executeFutureToPromise = f => f.fork(reject => {return new Promise.reject(reject.value())}, resolve => {return Pomise.resolve(resolve.value())});

    var isTrue = R.compose(R.map(R.lift(R.equals(true))));

    var log         = (x) => {
        console.log('==========log=========');
        console.log(x);
        console.log('==========ENDlog=========');
        return x;
    };
    var logPlus     = R.curry((y, x) => {
        console.log('==========log ' + y + '=========');
        console.log(x);
        console.log('==========ENDlog ' + y + '=========');
        return x;
    });
    var logForkPlus = R.curry((y, x)  => {
        var fr, sr;
        x.fork(f=> {
              console.log('==========log failure ' + y + '=========');
              console.log(f);
              console.log('==========ENDlog failure ' + y + '=========');
              fr = f;
          },
          s=> {
              console.log('==========log success ' + y + '=========');
              console.log(s);
              console.log('==========ENDlog success ' + y + '=========');
              sr = s;
          });

        return sr ? Future((rej, res)=> res(sr)) : Future((rej, res)=> rej(fr));
    });
    var logFork     = x  => {
        var fr, sr;
        x.fork(f=> {
              console.log('==========log failure=========');
              console.log(f);
              console.log('==========ENDlog failure=========');
              fr = f;
          },
          s=> {
              console.log('==========log success=========');
              console.log(s);
              console.log('==========ENDlog success=========');
              sr = s;
          });

        return sr ? Future((rej, res)=> res(sr)) : Future((rej, res)=> rej(fr));
    };

    var loggerTap = (payload, level, msg) => {
        logger[level || 'trace'](msg || payload);
        return payload;
    };

    return {
        Maybe,
        safeProp,
        startsWith,
        getSafeValue,
        safeParseBuffer,
        safeCreateBuffer,
        tryParseJSON,
        tryStringify,
        isTrue,
        boolToMaybe,
        executeFutureToPromise,
        log,
        logPlus,
        logFork,
        logForkPlus,
        loggerTap,
        // futureToPromise,
        Future
    }
};
