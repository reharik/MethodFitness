/**
 * Created by reharik on 4/15/16.
 */

export const pageSize = 20;

export const height = '400px';

//export const events = {
//    HANDLE_CELL_CLICK: (cell, reactEvent, id, browserEvent) => {
//        console.log('On Cell Click Event');
//    },
//    HANDLE_CELL_DOUBLE_CLICK: (cell, reactEvent, id, browserEvent) => {
//        console.log('On Cell Double Click Event');
//    },
//    HANDLE_ROW_CLICK: (row, reactEvent, id, browserEvent) => {
//        console.log('On Row Click Event');
//    },
//    HANDLE_ROW_DOUBLE_CLICK: (row, reactEvent, id, browserEvent) => {
//        console.log('On Row Double Click Event');
//    },
//    HANDLE_BEFORE_SELECTION: () => {
//        console.log('On Before Selection');
//    },
//    HANDLE_AFTER_SELECTION: () => {
//        console.log('On After Selection');
//    },
//    HANDLE_AFTER_INLINE_EDITOR_SAVE: () => {
//        console.log('On After Save Inline Editor Event');
//    },
//    HANDLE_BEFORE_BULKACTION_SHOW: () => {
//        console.log('On Before Bulk Action Show');
//    },
//    HANDLE_AFTER_BULKACTION_SHOW: () => {
//        console.log('On After Bulk Action Show');
//    }
//};

export const plugins = {
  COLUMN_MANAGER: {
    sortable: {
      enabled: true,
      method: 'remote',
      sortingSource: 'http://react-redux-grid.herokuapp.com/getfakeData',
    },
  },
  //PAGER: {
  //    enabled: true,
  //    pagingType: 'remote',
  //    pagingSource: 'http://react-redux-grid.herokuapp.com/getFakedPagedData'
  //},
  LOADER: {
    enabled: true,
  },
  SELECTION_MODEL: {
    mode: 'checkbox-multi',
    enabled: true,
    allowDeselect: true,
    activeCls: 'active',
    selectionEvent: 'singleclick',
  },
  ERROR_HANDLER: {
    defaultErrorMessage: 'AN ERROR OCURRED',
    enabled: true,
  }, //,
  //BULK_ACTIONS: {
  //    enabled: true,
  //    actions: [
  //        {
  //            text: 'Move',
  //            EVENT_HANDLER: () => {
  //
  //            }
  //        },
  //        {
  //            text: 'Add',
  //            EVENT_HANDLER: () => {
  //
  //            }
  //        }
  //    ]
  //},
  //GRID_ACTIONS: {
  //    iconCls: 'action-icon',
  //    menu: [
  //        {
  //            text: 'Delete',
  //            EVENT_HANDLER: () => {
  //
  //            }
  //        }
  //    ]
  //}
};
