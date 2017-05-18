import React from 'react';
import Header from './Header';
import Row from './Row';
import uuid from 'uuid';

const Table = ({columns, tableData=[], sort}) => {
  return (
    <div >
      <Header columns={columns} sort={sort} />
      {tableData.map(d => (<Row columns={columns} data={d} key={uuid.v4()} />))}
    </div>);
}

Table.contextTypes = {
};

export default Table;

