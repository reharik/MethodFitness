import React, { Component } from 'react';
import classNames from 'classnames';
import InputFor from './InputFor';
import LabelFor from './LabelFor';

const SubmissionFor = ({ data, containerStyle, noLabel, selectOptions, onChange }) => {
  const _containerStyle = classNames('editor__container', containerStyle);
  return (
    <div className={_containerStyle}>
      {noLabel ? null : LabelFor({ data })}
      {InputFor({ data, selectOptions, onChange })}
    </div>
  );
};

export default SubmissionFor;
