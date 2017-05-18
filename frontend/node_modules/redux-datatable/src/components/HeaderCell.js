import React from 'react';

const HeaderCell = ({column, value, sort}) => {
  const style = column.hidden
    ? { display: 'none'}
    : { width: column.width || '100px' };
  const className = `redux__datatable__header__cell 
      ${column.headerClassName || ''} `;
  let action = column.sort ? sort : () => {};
  action = action ? action : column.headerAction ? column.headerAction : () => {};

  return (
    <div className={className} style={style} onClick={e => action(column)} >
      {value}
      {column.dir ? <span className={'redux__datatable__' + column.dir }>^</span>:null}
      </div>
  );
};

HeaderCell.contextTypes = {
};

export default HeaderCell;

