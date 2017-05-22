import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const InlineValidationFor = data => {
  // if you use inline you'll need to adjust the height of the input container
  let validationStyle = classNames({
    editor__container__validation__error: data.errors.length > 0,
    editor__container__validation__success: data.errors.length === 0
  });

  let val = data.errors.length > 0 ? data.error : '';
  return (<div className={validationStyle}>{val}</div>);
};

InlineValidationFor.propType = {
  data: PropTypes.object
};

export default InlineValidationFor;
