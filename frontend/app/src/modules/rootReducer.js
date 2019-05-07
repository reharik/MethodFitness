import { combineReducers } from 'redux';
import { reducer as notifs } from 'redux-notifications';
import appointments from './../modules/appointmentModule';
import local from './../modules/index';
// import { LOGOUT } from './../modules/authModule';
import { connectRouter } from 'connected-react-router';

const appReducer = (history) => combineReducers({
  router: connectRouter(history),
  appointments,
  notifs,
  ...local,
});

// const rootReducer = (state, action) => {
//   if (action.type === LOGOUT.SUCCESS) {
//     // const { routing, schema } = state;
//     // state = { routing, schema };
//     return state;
//   }
//
//   return appReducer(state, action);
// };

export default appReducer;
