import React from 'react';
import PropTypes from 'prop-types';

const LabelFor = ({ data }) => {
  const required = data.rules.some(x => x.rule === 'required') ? '*' : '';

  return (
    <div className="editor_label">
      <label className="editor__container__label" htmlFor={data.name}>{data.label + required}</label>
    </div>
  );
};

LabelFor.propTypes = {
  data: PropTypes.object
};

export default LabelFor;
