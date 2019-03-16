import reducerMerge from './../utilities/reducerMerge';
import config from './../utilities/configValues';
import { requestStates } from '../sagas/requestSaga';
// import selectn from 'selectn';

export const FETCH_TRAINER_PAYMENT_DETAILS = requestStates(
  'fetch_trainer_payment_details',
  'trainerPaymentDetails',
);

export default (state = [], action = {}) => {
  switch (action.type) {
    case FETCH_TRAINER_PAYMENT_DETAILS.SUCCESS: {
      return reducerMerge(state, action.response, 'paymentId');
    }
    default:
      return state;
  }
};

export function fetchTrainerPaymentDetails(paymentId, trainerId) {
  return {
    type: FETCH_TRAINER_PAYMENT_DETAILS.REQUEST,
    states: FETCH_TRAINER_PAYMENT_DETAILS,
    url: `${config.apiBase}trainerPaymentDetails/${paymentId}${trainerId ? `/${trainerId}` : ''}`,
    params: {
      method: 'GET',
      credentials: 'include',
    },
  };
}
