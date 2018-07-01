import selectn from 'selectn';
export const NOTIFICATION = 'methodFit/notifications/NOTIFICATION';
export const CLEAR_NOTIFICATION = 'methodFit/notifications/CLEAR_NOTIFICATION';

export default (state = {}, action = {}) => {
  if (action.type.includes('_FAILURE')) {
    let status = selectn('message.status', action);
    switch (status) {
      case 401: {
        if (selectn('action.url', action).includes('auth')) {
          return {
            ...state,
            [action.type]: { type: 'error', message: 'invalid creds yo' },
          };
        }
        return state;
      }
      case 500: {
        return {
          ...state,
          [action.type]: { type: 'error', message: 'An Error Has Occurred!' },
        };
      }
      case 422:
      case 409: {
        // get message from result
        return {
          ...state,
          [action.type]: { type: 'error', message: 'invalid creds yo' },
        };
      }
      default:
        return state;
    }
  }
  if (action.type === CLEAR_NOTIFICATION) {
    let mut = delete state[action.name];
    return { ...mut };
  }
  return state;
};

export const clearNotification = name => {
  return {
    type: CLEAR_NOTIFICATION,
    name,
  };
};

export const notifications = (messages, containerName, name) => {
  return {
    type: NOTIFICATION,
    messages,
    containerName,
    name,
  };
};
