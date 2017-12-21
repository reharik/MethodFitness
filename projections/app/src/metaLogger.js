module.exports = function(logger) {
  const iterateArguments = (args, before, after) => {
    let result = before || '';
    Object.keys(args).forEach(augKey =>
      result += itemToString(args[augKey]) + '\n'
    );
    result += after || '';
    return result;
  };

  const itemToString = item => {
    if (typeof item === 'object') {
      return JSON.stringify(item, null, 4);
    }
    if (typeof item === 'function') {
      return item.toString();
    }
    return item;
  };

  const defaultConfig = {
    beforeExecution: (logger, key, name, args) => {
      let resolvedName = name || 'anonymous function';
      logger.debug(`${key} called in ${resolvedName}`);
      logger.trace(iterateArguments(args, `${key} called with ${args.length <= 0 ? 'no ' : ''}arguments \n`));
    },
    afterExecution: (logger, key, name, result) => {
      logger.trace(`${key} result:\n ${itemToString(result)}`);
    }
  };

  const wrapper = function(_config) {
    let config = _config || {};
    if (!(config.beforeExecution || config.afterExecution)) {
      config = defaultConfig;
    }

    return function(obj, name) {
      let decorated = {};
      Object.keys(obj).forEach(function(key) {
        if (typeof obj[key] !== 'function') {
          decorated[key] = obj[key];
        } else {

          let wrapped = function() {
            config.beforeExecution(logger, key, name, arguments);
            let result = obj[key](...arguments);
            if (result) {
              config.afterExecution(logger, key, name, result);
            }
            return result;
          };
          wrapped.toStringWrapper = wrapped.toString();
          wrapped.toString = obj[key].toString.bind(obj[key]);
          decorated[key] = wrapped;
        }
      });
      return decorated;
    };
  };

  return {
    wrapper,
    iterateArguments,
    itemToString
  };
};
