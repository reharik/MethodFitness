export const CLEAR_AJAX_STATE = 'methodFit/ajaxState/CLEAR_AJAX_STATE';
export const REQ_AJAX_STATE = 'methodFit/ajaxState/REQ_AJAX_STATE';
export const SUCCESS_AJAX_STATE = 'methodFit/ajaxState/SUCCESS_AJAX_STATE';
export const FAILURE_AJAX_STATE = 'methodFit/ajaxState/FAILURE_AJAX_STATE';

export default (state = {}, action = {}) => {
  let newState = { ...state };

  switch (action.type) {
    case CLEAR_AJAX_STATE: {
      return state;
    }
    case REQ_AJAX_STATE: {
      newState[action.actionPrefix] = { type: 'REQUEST' };
      return newState;
    }
    case SUCCESS_AJAX_STATE: {
      if (newState[action.actionPrefix] && newState[action.actionPrefix].type !== 'REQUEST') {
        delete newState[action.actionPrefix];
        return newState;
      }
      newState[action.actionPrefix] = { type: 'SUCCESS' };
      return newState;
    }
    case FAILURE_AJAX_STATE: {
      if (newState[action.actionPrefix] && newState[action.actionPrefix].type !== 'REQUEST') {
        delete newState[action.actionPrefix];
        return newState;
      }
      newState[action.actionPrefix] = {
        type: 'FAILURE',
        errors: action.errors
      };
      return newState;
    }
  }

  return state;
};

export const clearAjaxState = ajaxType => {
  return {
    type: CLEAR_AJAX_STATE,
    ajaxType
  };
};
