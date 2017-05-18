import React from 'react';
import HeaderCell from './HeaderCell';
import uuid from 'uuid';

const Header = ({columns, sort}) => {
  const getValue = function(c) {
   return c.headerFormat
      ? c.headerFormat({column:c, value:c.display, row:columns})
      : c.display;
  };
  return (
    <div className="redux__datatable__table__header">
      { columns.map(c => (<HeaderCell sort={sort} value={getValue(c)} column={c} key={uuid.v4()} /> )) }
    </div>);
};

Header.contextTypes = {
};

export default Header;

