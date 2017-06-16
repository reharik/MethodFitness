// validate.js


module.exports = function() {
  function isEmpty(value) {
    return { valid: value === undefined || value === '' || Object.keys(value).length === 0 };
  }

  function validate(value, schema) {
    // if no schema, treat as an error
    if (schema === undefined) {
      return {
        success: false,
        errors: [{ message: `can not validate: ${JSON.stringify(value)}, when there is no applicable schema` }]
      };
    }
    return schema.validator(value);
  }

  function request(compiledPath, method, query, body, headers) {
    if (compiledPath === undefined) {
      return;
    }

    // get operation object for path and method
    let operation = compiledPath.path[method.toLowerCase()];
    if (operation === undefined) {
      // operation not defined, return 405 (method not allowed)
      return;
    }
    let parameters = operation.resolvedParameters;
    let validationResult = { success: true, errors: [], where: [] };
    let bodyDefined = false;

    // check all the parameters match swagger schema
    if (parameters.length === 0) {
      let emptyBodyResult = validate(body, { validator: isEmpty });
      if (!emptyBodyResult.valid) {
        validationResult.success = false;
        validationResult.errors.push(`Expected empty body but received ${body}`);
        validationResult.where.push('body');
      }

      if (query !== undefined && Object.keys(query).length > 0) {
        validationResult.success = false;
        validationResult.errors.push(`Expected empty query string but received ${JSON.stringify(query)}`);
        validationResult.where.push('query');
      }

      return validationResult;
    }

    parameters.forEach(function(parameter) {
      let value;
      switch (parameter.in) {
        case 'query':
          value = (query || {})[parameter.name];
          break;
        case 'path': {
          let actual = compiledPath.name.match(/[^\/]+/g);
          let valueIndex = compiledPath.expected.indexOf('{' + parameter.name + '}');
          value = actual ? actual[valueIndex] : undefined;
          break;
        }
        case 'body':
          value = body;
          bodyDefined = true;
          break;
        case 'header':
          value = (headers || {})[parameter.name];
          break;
        default:
      }
      let paramResult = validate(value, parameter);
      if (!paramResult.valid) {
        validationResult.success = false;
        validationResult.errors = validationResult.errors.concat(paramResult.errors);
        validationResult.where.push(parameter.in);
      }
    });
    // ensure body is undefined if no body schema is defined
    if (!bodyDefined && body !== undefined) {
      let error = validate(body, { validator: isEmpty });
      if (!error.valid) {
        validationResult.success = false;
        validationResult.where.push('body');
        validationResult.errors.push(`Expected empty body but received ${JSON.stringify(body)}`);
      }
    }
    return validationResult;
  }

  function response(compiledPath, method, status, body) {
    if (compiledPath === undefined) {
      return {
        actual: 'UNDEFINED_PATH',
        expected: 'PATH'
      };
    }
    let operation = compiledPath.path[method.toLowerCase()];
    // check the res matches the swagger schema

    let validationResult = { success: true, errors: [], where: [] };
    let res = operation.responses[status];
    if (!res.schema && !body) {
      return validationResult;
    }
    let result = {};
    if (res) {
      result = validate(body, res);
    } else {
      result.valid = false;
      result.errors = [{ message: `No response provided in schema for status: ${status}` }];
    }

    if (!result.valid) {
      validationResult.success = false;
      validationResult.errors = result.errors;
      validationResult.where.push('body');
    }
    return validationResult;
  }

  return {
    request,
    response
  };
};
