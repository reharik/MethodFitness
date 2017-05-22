import React, { Component } from 'react';
import classNames from 'classnames';
import InputFor from './InputFor';
import LabelFor from './LabelFor';

const SubmissionFor = ({ data, containerStyle, noLabel, selectOptions, onChange, horizontal }) => {
  const _containerStyle = classNames(containerStyle, {editor__container: !horizontal, display_conatainer: horizontal});
  return (
    <div className={_containerStyle}>
      {noLabel ? null : LabelFor({ data })}
      {InputFor({ data, selectOptions, onChange })}
    </div>
  );
};

export default SubmissionFor;
