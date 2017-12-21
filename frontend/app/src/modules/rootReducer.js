import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as notifs } from 'redux-notifications';
import { reduxTaskCalendar } from 'redux-task-calendar';
import appointments from './../modules/appointmentModule';
import local from './../modules/index';
import { LOGOUT } from './../modules/authModule';

const appReducer = combineReducers({
  reduxTaskCalendar,
  appointments,
  notifs,
  ...local,
  routing
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT.SUCCESS) {
    const { routing, schema } = state;
    state = { routing, schema };
  }

  return appReducer(state, action);
};

export default rootReducer;
