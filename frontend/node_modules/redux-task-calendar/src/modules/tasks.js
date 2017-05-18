// import { normalizeTasks } from '../utils/calendarUtils';
// import { unionWith, eqBy, prop } from 'ramda';
//
// export const CREATE_TASK_REQUEST = 'calendar/tasks/CREATE_TASK_REQUEST';
// export const CREATE_TASK_FAILURE = 'calendar/tasks/CREATE_TASK_FAILURE';
// export const CREATE_TASK_SUCCESS = 'calendar/tasks/CREATE_TASK_SUCCESS';
//
// export const REMOVE_TASK_REQUEST = 'calendar/tasks/REMOVE_TASK_REQUEST';
// export const REMOVE_TASK_FAILURE = 'calendar/tasks/REMOVE_TASK_FAILURE';
// export const REMOVE_TASK_SUCCESS = 'calendar/tasks/REMOVE_TASK_SUCCESS';
//
// export const UPDATE_TASK_REQUEST = 'calendar/tasks/UPDATE_TASK_REQUEST';
// export const UPDATE_TASK_FAILURE = 'calendar/tasks/UPDATE_TASK_FAILURE';
// export const UPDATE_TASK_SUCCESS = 'calendar/tasks/UPDATE_TASK_SUCCESS';
//
// export const UPDATE_TASK_VIA_DND_REQUEST = 'calendar/tasks/UPDATE_TASK_VIA_DND_REQUEST';
// export const UPDATE_TASK_VIA_DND_FAILURE = 'calendar/tasks/UPDATE_TASK_VIA_DND_FAILURE';
// export const UPDATE_TASK_VIA_DND_SUCCESS = 'calendar/tasks/UPDATE_TASK_VIA_DND_SUCCESS';
//
// export const RETRIEVE_TASKS_REQUEST = 'calendar/tasks/RETRIEVE_TASKS_REQUEST';
// export const RETRIEVE_TASKS_FAILURE = 'calendar/tasks/RETRIEVE_TASKS_FAILURE';
// export const RETRIEVE_TASKS_SUCCESS = 'calendar/tasks/RETRIEVE_TASKS_SUCCESS';
//
// export const TASK_DRAG_SOURCE = 'calendar/tasks/TASK_DRAG_SOURCE';
//
// export default (state = [], action = null) => {
//   var task;
//   switch (action.type) {
//     case RETRIEVE_TASKS_SUCCESS: {
//       let tasks;
//       try {
//         tasks = normalizeTasks(action.data.tasks, action.config);
//       } catch (ex) {
//         // for now till I figure out how to dispatch from reducer
//         throw ex;
//       }
//
//       return unionWith(eqBy(prop('id')), tasks, state);
//     }
//     case UPDATE_TASK_VIA_DND_SUCCESS: {
//       task = normalizeTasks(action.data.task, action.config)[0];
//       state.splice(state.findIndex(x => x.id === task.id), 1, task);
//       return [...state];
//     }
//     case UPDATE_TASK_SUCCESS: {
//       task = normalizeTasks(action.data.task, action.config)[0];
//       state.splice(state.findIndex(x => x.id === task.id), 1, task);
//       return [...state];
//     }
//     case CREATE_TASK_SUCCESS: {
//       task = normalizeTasks(action.data.task, action.config)[0];
//       state.push(task);
//       return [...state];
//     }
//     case REMOVE_TASK_SUCCESS: {
//       state.splice(state.findIndex(x => x.id === action.data.task.id), 1);
//       return [...state];
//     }
//   }
//
//   return state;
// };
