

export default (fieldName, value, rule) => {
  const messages = {
    required: `field '${fieldName}' is Required`,
    minlength: `field '${fieldName}' should be a minimum of '${rule.minLength}'`,
    maxlength: `field '${fieldName}' should be a certain maximum of '${rule.maxLength}'`,
    rangelength: `field '${fieldName}' should be a minimum of '${rule.minLength}' and a maximum of '${rule.maxLength}'`,
    email: `field '${fieldName}' should be valid email`,
    url: `field '${fieldName}' should be valid url`,
    date: `field '${fieldName}' should be a valid date`,
    number: `field '${fieldName}' should be a number`,
    digits: `field '${fieldName}' should be didgets`,
    creditcard: `field '${fieldName}' should be a valid creditcard`,
    equalTo: `field '${fieldName}' should be equal to '${rule.compareField}'`
  };
  return messages[rule.rule];
};
