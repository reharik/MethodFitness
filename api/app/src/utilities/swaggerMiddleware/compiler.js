// compiler.js

// var deref = require("json-schema-deref-sync");
/*
 * We need special handling for query validation, since they're all strings.
 * e.g. we must treat "5" as a valid number
 */

module.exports = function(
  jsonschemaderefsync,
  curriedValidator,
  mergeDistinct,
) {
  /*
   * We need special handling for query string validation, since they're all strings.
   * e.g. we must treat "5" as a valid number
   */

  function stringValidator(schema) {
    return function(value) {
      // if an optional field is not provided, we're all good other not so much
      if (value === undefined) {
        return !schema.required;
      }
      switch (schema.type) {
        case 'number':
        case 'integer':
          if (!isNaN(value)) {
            // if the value is a number, make sure it's a number
            value = +value;
          }
          break;
        case 'boolean':
          if (value === 'true') {
            value = true;
          } else if (value === 'false') {
            value = false;
          }
          break;
        case 'array':
          if (!Array.isArray(value)) {
            let format = schema.collectionFormat || 'csv';
            switch (format) {
              case 'csv':
                value = String(value).split(',');
                break;
              case 'ssv':
                value = String(value).split(' ');
                break;
              case 'tsv':
                value = String(value).split('\t');
                break;
              case 'pipes':
                value = String(value).split('|');
                break;
              case 'multi':
              default:
                value = [value];
                break;
            }
          }
          switch (schema.items.type) {
            case 'number':
            case 'integer':
              value = value.map(function(num) {
                if (!isNaN(num)) {
                  // if the value is a number, make sure it's a number
                  return +num;
                } else {
                  return num;
                }
              });
              break;
            case 'boolean':
              value = value.map(function(bool) {
                if (bool === 'true') {
                  return true;
                } else if (bool === 'false') {
                  return false;
                } else {
                  return bool;
                }
              });
              break;
            default:
          }
          break;
        default:
      }
      return !!value;
    };
  }

  function buildUpPathsForEndPoint(path, curriedValidatorWithDoc) {
    let compiledPath = Object.assign({}, path);
    Object.keys(path)
      .filter(function(name) {
        return name !== 'parameters';
      })
      .forEach(function(verbName) {
        let verb = buildUpParameters(path, verbName);
        addValidatorsToParameters(verb, curriedValidatorWithDoc);
        addValidatorsForResponses(verb, curriedValidatorWithDoc);
        compiledPath[verbName] = verb;
      });
    return compiledPath;
  }

  function buildUpParameters(path, verbName) {
    let verb = Object.assign({}, path[verbName]);
    // start with parameters at path level
    // merge in or replace parameters from verb level
    verb.resolvedParameters = mergeDistinct(path.parameters, verb.parameters);
    return verb;
  }

  function addValidatorsToParameters(verb, curriedValidatorWithDoc) {
    verb.resolvedParameters.forEach(function(parameter) {
      let schema = parameter.schema || parameter;
      if (parameter.in === 'query' || parameter.in === 'header') {
        parameter.validator = stringValidator(schema);
      } else {
        parameter.validator = curriedValidatorWithDoc(schema);
      }
    });
  }

  function addValidatorsForResponses(verb, curriedValidatorWithDoc) {
    Object.keys(verb.responses).forEach(function(statusCode) {
      let response = verb.responses[statusCode];
      if (response.schema) {
        response.validator = curriedValidatorWithDoc(response.schema);
      } else {
        // no schema, so ensure there is no response
        // tslint:disable-next-line:no-null-keyword
        response.validator = function(body) {
          return body === undefined || body === null || body === '';
        };
      }
    });
  }

  function compile(document, customValidators) {
    // the validation module is curried so we can add the document and custom validators now
    // and the actual values later as we get them.
    const curriedValidatorWithDoc = curriedValidator(
      document,
      customValidators,
    );
    // get the de-referenced version of the swagger document
    let swagger = jsonschemaderefsync(document);
    // add a validator for every parameter in swagger document
    let basePath = swagger.basePath || '';

    let compiledPaths = Object.keys(swagger.paths).map(name => {
      let item = swagger.paths[name];
      let path = buildUpPathsForEndPoint(item, curriedValidatorWithDoc);

      return {
        name,
        path,
        regex: new RegExp(basePath + name.replace(/\{[^}]*}/g, '[^/]+') + '$'),
        expected: (name.match(/[^\/]+/g) || []).map(s => s.toString()),
      };
    });

    return function(targetPath) {
      // get a list of matching paths, there should be only one
      let matches = compiledPaths.filter(
        path => !!targetPath.toLowerCase().match(path.regex),
      );
      return matches && matches.length === 1 ? matches[0] : null;
    };
  }
  return compile;
};
//# sourceMappingURL=compiler.js.map
