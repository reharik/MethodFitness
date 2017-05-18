import { combineReducers } from 'redux';
import { reduxTaskCalendar } from '../../src/index';
import tasks from './taskReducer';
import {reducer as formReducer} from 'redux-form';
import taskInProcess from './../actions/taskInProcess'

const reducers = combineReducers({
  tasks,
  reduxTaskCalendar,
  taskInProcess,
  form: formReducer
});
export default reducers;
