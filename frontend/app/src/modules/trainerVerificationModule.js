import reducerMerge from './../utilities/reducerMerge';
import config from './../utilities/configValues';
import { requestStates } from '../sagas/requestSaga';
// import selectn from 'selectn';

export const FETCH_TRAINER_VERIFICATION = requestStates('fetch_trainer_verification', 'trainerVerification');

export default (state = [], action = {}) => {
  switch (action.type) {
    case
    FETCH_TRAINER_VERIFICATION.SUCCESS: {
      return reducerMerge(state, action.response.appointments);
    }
    default:
      return state;
  }
};

export function fetchAppointmentsAction() {
  return {
    type: FETCH_TRAINER_VERIFICATION.REQUEST,
    states: FETCH_TRAINER_VERIFICATION,
    url: `${config.apiBase}fetchUnverifiedAppointments`,
    params: {
      method: 'GET',
      credentials: 'include'
    }
  };
}
