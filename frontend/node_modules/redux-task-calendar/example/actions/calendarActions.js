import { TASK_CLICKED, OPEN_SPACE_CLICKED, } from './../../src/index';
import { CALL_API } from 'redux-api-middleware';
import uuid from 'uuid';
import moment from 'moment';
import {reset } from 'redux-form';
const UPDATE_TASK_VIA_DND_SUCCESS = 'calendar/tasks/UPDATE_TASK_VIA_DND_SUCCESS';

// const retrieveData = (startTime, endTime) => {
//   return {
//     type: RETRIEVE_DATA,
//     startTime, endTime,
//     [CALL_API]: {
//       endpoint: 'url',
//       method: 'GET',
//       types: [
//         RETRIEVE_TASKS_REQUEST,
//         RETRIEVE_TASKS_FAILURE,
//         RETRIEVE_TASKS_SUCCESS]
//     }
//   };
// };

const taskClicked = (id, task) => {
  return {
    type: TASK_CLICKED,
    id,
    task
  };
};

const openSpaceCLicked = (date, time) => {
  return {
    type: OPEN_SPACE_CLICKED,
    date,
    time
  };
};

const updateTaskViaDND = (task) => {
  return {
    type: UPDATE_TASK_VIA_DND_SUCCESS,
    data: {
      task
    }
  };
};

const createTaskSubmitHandler = (values) => {
  if (values.id) {
    return {
      type: UPDATE_TASK_SUCCESS,
      data: {
        task: {
          display: values.display,
          startTime: values.startTime,
          endTime: values.endTime,
          color: values.color,
          id: values.id,
          date: values.date
        }
      }
    };
  } else {
    return {
      type: CREATE_TASK_SUCCESS,
      data: {
        task: {
          display: values.display,
          startTime: values.startTime,
          endTime: values.endTime,
          date: moment(),
          id: uuid.v4(),
          color: values.color
        }
      }
    };
  }
};

const removeTaskHandler = (id) => {
  return {
    type: REMOVE_TASK_SUCCESS,
    data: {
      task: {id}
    }
  }
};

export {
    // retrieveData,
    taskClicked,
    openSpaceCLicked,
  createTaskSubmitHandler,
  removeTaskHandler,
  updateTaskViaDND
};

