import reducerMerge from './../utilities/reducerMerge';
import config from './../utilities/configValues';
import { requestStates } from '../sagas/requestSaga';
// import selectn from 'selectn';

export const SUBMIT_TRAINER_PAYMENT = requestStates('submit_trainer_payment', 'trainerPayment');
export const FETCH_TRAINER_PAYMENTS = requestStates('fetch_trainer_payments', 'trainerPayment');

export default (state = [], action = {}) => {
  switch (action.type) {
    case FETCH_TRAINER_PAYMENTS.SUCCESS: {
      return reducerMerge(state, action.response, 'paymentId');
    }
    default:
      return state;
  }
};

export function fetchTrainerPayments() {
  return {
    type: FETCH_TRAINER_PAYMENTS.REQUEST,
    states: FETCH_TRAINER_PAYMENTS,
    url: `${config.apiBase}trainerPayments`,
    params: {
      method: 'GET',
      credentials: 'include'
    }
  };
}

export function submitTrainerPayment(data) {
  return {
    type: SUBMIT_TRAINER_PAYMENT.REQUEST,
    states: SUBMIT_TRAINER_PAYMENT,
    url: config.apiBase + `payTrainer/${data.trainerId}`,
    params: {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: data
    }
  };
}
