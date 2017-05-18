import React from 'react';

const LabelFor = ({data}) => {
  const required = data.rules.some(x=>x.rule == 'required') ? '*' : '';

  return (
    <div className="editor_label">
      <label className="editor__container__label" htmlFor={data.name}>{data.label + required}</label>
    </div>);

};

export default LabelFor;
