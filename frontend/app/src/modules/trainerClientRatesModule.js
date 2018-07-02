import config from './../utilities/configValues';
import selectn from 'selectn';
import reducerMerge from './../utilities/reducerMerge';
import { requestStates } from '../sagas/requestSaga';

export const UPDATE_TRAINER_CLIENT_RATES = requestStates(
  'update_trainer_client_rates',
  'trainer',
);
export const GET_TRAINER_CLIENT_RATES = requestStates(
  'get_trainer_client_rates',
  'trainer',
);

export default (state = [], action = {}) => {
  switch (action.type) {
    case GET_TRAINER_CLIENT_RATES.SUCCESS: {
      return reducerMerge(state, action.response, ['trainerId', 'clientId']);
    }
    case UPDATE_TRAINER_CLIENT_RATES.SUCCESS: {
      let update = selectn('action.update', action);
      let updated = update.clientRates.map(x => ({
        trainerId: update.trainerId,
        clientId: x.clientId,
        rate: x.rate,
      }));
      return state.map(x => {
        const tcr = updated.find(
          t => t.trainerId === x.trainerId && t.clientId === x.clientId,
        );
        if (tcr && tcr.rate !== x.rate) {
          return tcr;
        }
        return x;
      });
    }
    default: {
      return state;
    }
  }
};

export function updateTrainersClientRate(data) {
  const item = {
    trainerId: data.trainerId,
    clientRates: data.clientRates,
  };

  return {
    type: UPDATE_TRAINER_CLIENT_RATES.REQUEST,
    states: UPDATE_TRAINER_CLIENT_RATES,
    url: config.apiBase + 'trainer/updateTrainersClientRates',
    update: data,
    params: {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    },
  };
}

export function getTrainerClientRates(trainerId) {
  let apiUrl = config.apiBase + 'trainer/gettrainerclientrates/' + trainerId;
  return {
    type: GET_TRAINER_CLIENT_RATES.REQUEST,
    states: GET_TRAINER_CLIENT_RATES,
    url: apiUrl,
    params: {
      method: 'GET',
      credentials: 'include',
    },
  };
}
