import reducerMerge from './../utilities/reducerMerge';
import config from './../utilities/configValues';
import { requestStates } from '../sagas/requestSaga';
// import selectn from 'selectn';

export const FETCH_TRAINER_PAYABLES = requestStates('fetch_trainer_payables', 'payTrainer');

export default (state = [], action = {}) => {
  switch (action.type) {
    case
    FETCH_TRAINER_PAYABLES.SUCCESS: {
      return reducerMerge(state, action.response);
    }
    default:
      return state;
  }
};

export function fetchAppointmentsAction(trainerId) {
  return {
    type: FETCH_TRAINER_PAYABLES.REQUEST,
    states: FETCH_TRAINER_PAYABLES,
    url: `${config.apiBase}fetchVerifiedAppointments/${trainerId}`,
    params: {
      method: 'GET',
      credentials: 'include'
    }
  };
}
