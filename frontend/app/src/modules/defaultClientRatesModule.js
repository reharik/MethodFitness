import config from './../utilities/configValues';
import selectn from 'selectn';
import reducerMerge from './../utilities/reducerMerge';
import { requestStates } from '../sagas/requestSaga';
import { DEFAULT_KEY, generateCacheTTL } from 'redux-cache';

export const UPDATE_DEFAULT_CLIENT_RATES = requestStates(
  'update_location',
  'location',
);

export const DEFAULT_CLIENT_RATES = requestStates('defaultClientRates');

export default (state = { [DEFAULT_KEY]: null, results: [] }, action = {}) => {
  switch (action.type) {
    case DEFAULT_CLIENT_RATES.REQUEST: {
      return state;
    }
    case DEFAULT_CLIENT_RATES.SUCCESS: {
      return {
        ...state,
        [DEFAULT_KEY]: generateCacheTTL(),
        results: reducerMerge(
          state.results,
          action.response,
          'defaultClientRatesId',
        ),
      };
    }
    case UPDATE_DEFAULT_CLIENT_RATES.SUCCESS: {
      let update = selectn('action.update', action);

      return {
        ...state,
        results: state.results.map(x => {
          if (x.defaultClientRatesId === update.defaultClientRatesId) {
            return {
              ...update,
            };
          }
          return x;
        }),
      };
    }

    default: {
      return state;
    }
  }
};

export function updateDefaultClientRates(data) {
  return {
    type: UPDATE_DEFAULT_CLIENT_RATES.REQUEST,
    states: UPDATE_DEFAULT_CLIENT_RATES,
    url: config.apiBase + 'defaultclientrates/updatedefaultclientrates',
    update: data,
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

export function fetchDefaultClientRates() {
  let apiUrl = config.apiBase + 'defaultclientrates/getdefaultclientrates';
  return {
    type: DEFAULT_CLIENT_RATES.REQUEST,
    states: DEFAULT_CLIENT_RATES,
    url: apiUrl,
    params: {
      method: 'GET',
      credentials: 'include',
    },
  };
}
