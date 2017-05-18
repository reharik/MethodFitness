import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { config } from './../utilities/configValues';
import { selectAll, deselectAll, setSelection, handleSelectionEvent } from '../modules/tableModule';

const checkBox = ({column, row, identityColumn, dispatch}) => {
  const change = function(e, row, column) {
      return handleSelectionEvent(setSelection(column, row[identityColumn], e.currentTarget.checked), dispatch);
  };
  const selected = row.metaData ? row.metaData.selected : false;
  return (
    <div>
      <input type="checkbox" checked={selected}  onChange={e => change(e, row, column) }/>
    </div>);
};

const headerCheckBox = ({selectAllChecked, dispatch}) => {
  const change = function(e) {
    if(e.currentTarget.checked){
      return handleSelectionEvent(selectAll(), dispatch);
    } else {
      return handleSelectionEvent(deselectAll(), dispatch);
    }
  };
  return (
    <div>
      <input type="checkbox" checked={selectAllChecked} onChange={e => change(e) }/>
    </div>);
};

const CheckBox = connect()(checkBox);
const HeaderCheckBox = connect( x=> ({selectAllChecked: x.reduxDataTable[config.tableName] ? x.reduxDataTable[config.tableName].selectAll:false}))(headerCheckBox);

export function bulkSelectionColumn(config) {
  return {
    bulkSelection: config.bulkSelection,
    property: 'checkbox',
    width: '30px',
    format: ({column, value, row}) => (<CheckBox
      column={column}
      row={row}
      identityColumn={config.bulkSelection.identityColumn}/>),
    headerFormat: ({column, value, row}) => (<HeaderCheckBox />),
    headerClassName:'redux__datatable__bulkSelect',
    className:'redux__datatable__bulkSelect',
    hidden: false
  }
}

