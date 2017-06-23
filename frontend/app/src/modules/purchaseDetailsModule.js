import config from './../utilities/configValues';
import reducerMerge from './../utilities/reducerMerge';
import { requestStates } from '../sagas/requestSaga';

export const GET_PURCHASE_DETAILS = requestStates('get_purchase_details', 'purchase_details');

export default (state = [], action = {}) => {
  switch (action.type) {
    case GET_PURCHASE_DETAILS.SUCCESS: {
      return reducerMerge(state, action.response);
    }
    default:
      return state;
  }
};

export function getPurchaseDetails(id) {
  return {
    type: GET_PURCHASE_DETAILS.REQUEST,
    states: GET_PURCHASE_DETAILS,
    url: `${config.apiBase}purchaselist/fetchpurchaseDetails/${id}`,
    params: {
      method: 'GET',
      credentials: 'include'
    }
  };
}
