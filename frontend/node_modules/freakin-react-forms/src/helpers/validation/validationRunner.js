import errorMessages from './errorMessages';
import validationRules from './validationRules';

export default (field, fields) => {
  let _valid = [];
  if (!field) {
    throw new Error('You must provide a field to validate');
  }
  if (!field.rules || field.rules.length <= 0) {
    return _valid;
  }
  if (!Array.isArray(field.rules)) {
    field.rules = [field.rules];
  }
  if (!field.value && !field.rules.some(item => item.rule.toLowerCase() === 'required')) {
    return _valid;
  }
  return field.rules
    .filter(rule => !validationRules[rule.rule](field, rule, fields))
    .map(rule => ({
      formName: field.formName,
      fieldName: field.name,
      message: errorMessages(field.label, field.value, rule),
      rule: rule.rule
    }));
};
