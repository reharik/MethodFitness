import React from 'react';

import { config } from './../utilities/configValues';
import { unionWith, uniq, eqBy, prop } from 'ramda';

export const NO_EVENT = 'redux-datatable/bulkAction/NO_EVENT';
export const SELECT_ALL = 'redux-datatable/bulkAction/SELECT_ALL';
export const DESELECT_ALL = 'redux-datatable/bulkAction/DESELECT_ALL';
export const SELECT_ITEM = 'redux-datatable/bulkAction/SELECT_ITEM';
export const DESELECT_ITEM = 'redux-datatable/bulkAction/DESELECT_ITEM';
export const SET_CONFIG = 'redux-datatable/column/SET_CONFIG';
export const SET_COLUMNS = 'redux-datatable/column/SET_COLUMNS';
export const SORT = 'redux-datatable/column/SORT';

var selectItem = (state = [], action) => {
  return uniq(state.push(action.id));
};

var deselectItem = (state = [], action) => {
  return state.filter(x => x != action.id);
}

const tableReducer =  (state = {}, action = null) => {

  switch (action.type) {
    case SELECT_ALL: {
      return {
        ...state[config.tableName],
        selectedItems: action.ids,
        selectAll:true}
    }
    case DESELECT_ALL: {
      return {
        ...state[config.tableName],
        selectedItems: [],
        selectAll:false}
    }
    case SELECT_ITEM: {
      return {
        ...state[config.tableName],
        selectedItems: selectItem(state, action)
      }
    }

    case DESELECT_ITEM: {
      return {
        ...state[config.tableName],
        selectedItems: deselectItem(state, action)
      }
    }
    case SORT: {
      return {
        ...state[config.tableName],
        sort: {property:action.property, dir:action.dir}
      };
    }
    case SET_COLUMNS: {
      return {
        ...state,
        columns: action.columns
      }
    }
  }
  return state;
};

export default (state = {}, action = null) => {
  if (action.type == SET_CONFIG) {
    return {...state, [action.config.tableName]: {config: action.config}}
  } else if(state[action.tableName]) {
    return {
      ...state,
      [action.tableName]: tableReducer(state[action.tableName], action)
    };
  }
  return state;
}

// I have to curry all these actions to get the table name into them


export function handleSelectionEvent (selectionEvent, dispatch) {

  if (config.HANDLE_BEFORE_SELECTION) {
    config.HANDLE_BEFORE_SELECTION(selectionEvent, disptach);
  }

  if (config.HANDLE_BEFORE_BULKACTION_SHOW) {
    config.HANDLE_BEFORE_BULKACTION_SHOW(selectionEvent, disptach);
  }

  dispatch(selectionEvent);

  if (config.HANDLE_AFTER_SELECTION) {
    config.HANDLE_AFTER_SELECTION(selectionEvent, disptach);
  }

  if (config.HANDLE_AFTER_BULKACTION_SHOW) {
    config.HANDLE_AFTER_BULKACTION_SHOW(selectionEvent, disptach);
  }
}

export function selectAll(tableName) {
  return (itemIds) => {
    return {
      type: SELECT_ALL,
      tableName,
      ids: itemIds
    };
  }
}

export function deselectAll(tableName) {
  return () => {
    return {type: DESELECT_ALL, tableName};
  }
}

export function setSelection(tableName) {
  return (column, id) => {
    if (column.bulkSelection.mode === 'disabled' || column.bulkSelection.mode === 'none') {
      console.warn('Selection mode has been disabled');
      return {type: NO_EVENT};
    }

    return {
      type: SELECT_ITEM,
      id,
      tableName,
      selectionMode: column.bulkSelection.mode
    };
  }
}

export function setColumns(tableName) {
  return (columns) => {
    //TODO validateColumns here please
    return {
      type: SET_COLUMNS,
      tableName,
      columns
    };
  }
}

export function setConfig(config) {
  return {
    type: SET_CONFIG,
    config
  };
}

export function sort(tableName) {
  return (column) => {
    if (config.sortAsync) {

    } else {
      return {
        type: SORT,
        tableName,
        property: column.sortProperty,
        dir: column.dir === 'asc' ? 'desc' : 'asc'
      };
    }
  }
}

// this is saying if this property has a value use it,
// else try the propety ... property, and if that's a func
// then you are screwed and you don't ge a value result
function getValue(opts, prop){
  if(prop && prop.length>0){
    return prop;
  }else if(opts.property !== 'function'){
    return opts.property;
  }
  return undefind;
}

export function column (opts) {
  //TODO put in validation
  var sortProperty = getValue(opts, opts.sortProperty);
  var display = getValue(opts, opts.display);
  var sort = opts.sort;
  if(!sort || !sortProperty){
    sort = false;
  }

  return {
    property: opts.property,
    display,
    propertyName: opts.propertyName,
    width: opts.width || '100px',
    additionalStyle: opts.additionalStyle,
    className: opts.className,
    headerClassName: opts.headerClassName,
    headerFormat: opts.headerFormat,
    hidden: opts.hidden,
    sort,
    sortProperty
  }
}


//
// column schema
// {
//   property: 'email', :required
//     display: 'Email', defaults to property name
//   width: '100px',
//   additionalStyle: { max-width: 20px }
//   className: 'additional-class',
//   headerClassName: 'someHeaderName',
//   format: ({ column, value, row }) => {
//   return (<div style={{color:"Red"}} >value</div>);
// }
//   headerFormat: ({ column, value, row }) => {
//   return (<div style={{color:"Red"}} >value</div>);
// },
//   hidden: false
// }
