import reducerMerge from './../utilities/reducerMerge';
import config from './../utilities/configValues';
import { requestStates } from '../sagas/requestSaga';
import selectn from 'selectn';

export const FETCH_TRAINER_VERIFICATION = requestStates('fetch_trainer_verification', 'sessionPayment');
export const SUBMIT_TRAINER_VERIFICATION = requestStates('submit_trainer_verification', 'sessionPayment');
export const FETCH_TRAINER_PAYABLES = requestStates('fetch_trainer_payables', 'sessionPayment');
export const SUBMIT_TRAINER_PAYMENT = requestStates('submit_trainer_payment', 'sessionPayment');

export default (state = [], action = {}) => {
  switch (action.type) {
    case FETCH_TRAINER_PAYABLES.SUCCESS:
    case FETCH_TRAINER_VERIFICATION.SUCCESS: {
      return reducerMerge(state, action.response, 'selectionId');
    }
    case SUBMIT_TRAINER_VERIFICATION.SUCCESS: {
      let ids = JSON.parse(selectn('action.params.body.sessionIds', action));

      return state.map(x => ids.includes(x.sessionId) ? {...x, verified: true} : x);
    }
    case SUBMIT_TRAINER_PAYMENT.SUCCESS: {
      let ids = JSON.parse(selectn('action.params.body.sessionIds', action));
      return state.filter(x => !ids.includes(x.sessionId));
    }
    default:
      return state;
  }
};

export function fetchUnverifiedAppointments() {
  return {
    type: FETCH_TRAINER_VERIFICATION.REQUEST,
    states: FETCH_TRAINER_VERIFICATION,
    url: `${config.apiBase}trainerVerification/fetchUnverifiedAppointments`,
    params: {
      method: 'GET',
      credentials: 'include'
    }
  };
}

export function verifyAppointments(data) {
  return {
    type: SUBMIT_TRAINER_VERIFICATION.REQUEST,
    states: SUBMIT_TRAINER_VERIFICATION,
    url: config.apiBase + 'trainerVerification/verifyappointments',
    params: {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: data
    }
  };
}

export function fetchVerifiedAppointments(trainerId) {
  return {
    type: FETCH_TRAINER_PAYABLES.REQUEST,
    states: FETCH_TRAINER_PAYABLES,
    url: `${config.apiBase}/payTrainer/fetchVerifiedAppointments/${trainerId}`,
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
