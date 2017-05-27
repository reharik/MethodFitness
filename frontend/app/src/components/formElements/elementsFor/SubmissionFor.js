import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import inputFor from './InputFor';
import labelFor from './LabelFor';

const SubmissionFor = ({ data, containerStyle, noLabel, selectOptions, onChange, horizontal }) => {
  const _containerStyle = classNames(containerStyle, {editor__container: !horizontal, display_conatainer: horizontal});
  return (
    <div className={_containerStyle}>
      {noLabel ? null : labelFor({ data })}
      {inputFor({ data, selectOptions, onChange })}
    </div>
  );
};

SubmissionFor.propTypes = {
  data: PropTypes.object,
  containerStyle: PropTypes.string,
  noLabel: PropTypes.bool,
  selectOptions: PropTypes.array,
  onChange: PropTypes.func,
  horizontal: PropTypes.bool
};

export default SubmissionFor;
