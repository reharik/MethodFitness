import config from './../utilities/configValues';
import { browserHistory } from 'react-router';
import reducerMerge from './../utilities/reducerMerge';
import { requestStates } from '../sagas/requestSaga';
import { fetchClientAction } from './clientModule';
import selectn from 'selectn';

import { delay } from 'redux-saga';

export const PURCHASE_SESSIONS = requestStates(
  'purchase_sessions',
  'purchase_sessions',
);
export const SESSIONS_REFUND = requestStates(
  'SESSIONS_REFUND',
  'sessions_refund',
);
export const GET_PURCHASES = requestStates(
  'get_purchases',
  'purchase_sessions',
);

export default (state = [], action = {}) => {
  switch (action.type) {
    case GET_PURCHASES.SUCCESS: {
      return reducerMerge(state, action.response, 'purchaseId');
    }
    case SESSIONS_REFUND.SUCCESS: {
      let selectedIds =
        JSON.stringify(selectn('action.params.body', action)) || [];

      return state.map(x => {
        let _x = { ...x };
        _x.sessions = _x.sessions.map(y => {
          return selectedIds.includes(y.sessionId)
            ? { ...y, refunded: true }
            : y;
        });
        return _x;
      });
    }
    default:
      return state;
  }
};

// eslint-disable-next-line space-before-function-paren
const successFunction = async (action, payload) => {
  await delay(1000, { action, payload });
  browserHistory.push(`/purchases/${payload.payload.clientId}`);
  return {
    type: action.states.SUCCESS,
    action,
    payload,
  };
};

export function purchase(data) {
  return {
    type: PURCHASE_SESSIONS.REQUEST,
    states: PURCHASE_SESSIONS,
    url: config.apiBase + 'purchase/purchase',
    successFunction,
    subsequentAction: () => fetchClientAction(data.clientId),
    containerName: 'purchaseForm',
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

export function refundSessions(data) {
  return {
    type: SESSIONS_REFUND.REQUEST,
    states: SESSIONS_REFUND,
    url: config.apiBase + 'purchase/refundSessions',
    subsequentAction: () => getPurchases(data.clientId),
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

export function getPurchases(purchaseId) {
  return {
    type: GET_PURCHASES.REQUEST,
    states: GET_PURCHASES,
    url: `${config.apiBase}purchaselist/fetchpurchases/${purchaseId}`,
    params: {
      method: 'GET',
      credentials: 'include',
    },
  };
}
