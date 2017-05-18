import React from 'react';

const RowCell = ({text, style, className}) => {
  const cName = `redux__datatable__row__cell ${className || ''}`;
  return (<div className={cName} style={style} >{text}</div>);
};

RowCell.contextTypes = {
};

export default RowCell;

