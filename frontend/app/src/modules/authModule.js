import { requestStates } from '../sagas/requestSaga';
import configValues from './../utilities/configValues';
import selectn from 'selectn';
export const LOGIN = requestStates('login', 'auth');
export const LOGOUT = requestStates('logout', 'auth');
export const CHECK_AUTHENTICATION = requestStates('checkAuth', 'auth');
import { browserHistory } from 'react-router';

const initialState = {
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : '',
  isFetching: false,
  isAuthenticated: !!localStorage.getItem('id_token'),
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case CHECK_AUTHENTICATION.SUCCESS:
    case LOGIN.SUCCESS: {
      const user = selectn('response.user', action);

      localStorage.setItem('id_token', user.trainerId);
      localStorage.setItem('user', JSON.stringify(user));
      return {
        user,
        isAuthenticated: true,
        errorMessage: '',
      };
    }
    case 'LOGOUT_SUCCESS': {
      return {
        ...state,
        isAuthenticated: false,
      };
    }
    case CHECK_AUTHENTICATION.FAILURE: {
      // this hits for check_auth.failureaction, response, but not logout.success
      return Object.assign({}, state, {
        isAuthenticated: false,
      });
    }
    default:
      return state;
  }
};

const successFunction = (action, response) => {
  browserHistory.push('/');
  return {
    type: action.states.SUCCESS,
    action,
    response,
  };
};

const logoutSuccessFunction = (action, response) => {
  return {
    type: 'LOGOUT_SUCCESS',
    action,
    response,
  };
};

export function logoutUser() {
  localStorage.removeItem('id_token');
  localStorage.removeItem('user');
  localStorage.removeItem('menu_data');
  return {
    type: LOGOUT.REQUEST,
    states: LOGOUT,
    successFunction: logoutSuccessFunction,
    url: configValues.apiBase + 'signout',
    params: {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };
}

// const failureFunction = (action, response, payload) => {
//   return notifSend({
//     id: 'ajaxError',
//     containerName: 'signIn',
//     formName: 'signIn',
//     message: payload.message,
//     kind: 'danger'
//   });
// };

export function loginUser(data) {
  return {
    type: LOGIN.REQUEST,
    states: LOGIN,
    url: configValues.apiBase + 'auth',
    // failureFunction,
    containerName: 'signIn',
    successFunction,
    params: {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  };
}

export function checkAuth() {
  return {
    type: CHECK_AUTHENTICATION.REQUEST,
    states: CHECK_AUTHENTICATION,
    url: configValues.apiBase + 'checkAuth',
    containerName: 'signIn',
    params: {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };
}
