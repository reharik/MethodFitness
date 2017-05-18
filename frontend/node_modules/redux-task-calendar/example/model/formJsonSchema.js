var jsen = require('jsen');

export default (schema) => {
  const fields = Object.keys(schema.properties);
  const validate = buildValidationFn(schema);
  return {
    fields,
    validate
  }
}

function buildValidationFn(schema) {
  var validate = jsen(schema,{greedy:true});
  return (_formValues) => {
    let formValues = _formValues;
    var errors = {};
    //required says that the property is there not that the value length > 0
    Object.keys(formValues).forEach(k => {
       if(!formValues[k]){
         formValues[k] = undefined;
       }
     });

    var valid = validate(formValues);
    if (valid) {
      return errors;
    }

    var errs = validate.errors;
    errs.forEach(x=> errors[x.path] = x.message || x.keyword);
    return errors;
  }
}

