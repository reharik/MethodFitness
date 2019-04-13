import config from './../utilities/configValues';
import { browserHistory } from 'react-router';
import { denormalizeTrainer } from './../utilities/denormalize';
import selectn from 'selectn';
import reducerMerge from './../utilities/reducerMerge';
import { requestStates } from '../sagas/requestSaga';
import { DEFAULT_KEY, generateCacheTTL } from 'redux-cache';

export const HIRE_TRAINER = requestStates('hire_trainer', 'trainer');
export const UPDATE_TRAINER_PASSWORD = requestStates(
  'update_trainer_password',
  'trainer',
);
export const UPDATE_TRAINER_CONTACT = requestStates(
  'update_trainer_contact',
  'trainer',
);
export const UPDATE_TRAINER_ADDRESS = requestStates(
  'update_trainer_address',
  'trainer',
);
export const UPDATE_TRAINER_CLIENTS = requestStates(
  'update_trainer_clients',
  'trainer',
);
export const UPDATE_TRAINER_CLIENT_RATES = requestStates(
  'update_trainer_client_rates',
  'trainer',
);
export const UPDATE_TRAINER_INFO = requestStates(
  'update_trainer_info',
  'trainer',
);
export const UPDATE_DEFAULT_TRAINER_CLIENT_RATE = requestStates(
  'update_default_trainer_client_rate',
  'trainer',
);
export const TRAINER_LIST = requestStates('trainer_list', 'trainer');
export const ARCHIVE_TRAINER = requestStates('archive_trainer', 'trainer');
export const TRAINER = requestStates('trainer');

export default (state = { [DEFAULT_KEY]: null, results: [] }, action = {}) => {
  switch (action.type) {
    case HIRE_TRAINER.REQUEST:
    case TRAINER.REQUEST:
    case TRAINER_LIST.REQUEST: {
      console.log('HIRE_TRAINER_REQUEST');
      return state;
    }
    case TRAINER.SUCCESS: {
      return {
        ...state,
        [DEFAULT_KEY]: generateCacheTTL(),
        results: reducerMerge(state.results, action.response, 'trainerId'),
      };
    }
    case TRAINER_LIST.SUCCESS: {
      return {
        ...state,
        [DEFAULT_KEY]: generateCacheTTL(),
        results: reducerMerge(
          state.results,
          action.response.trainers,
          'trainerId',
        ),
      };
    }
    case HIRE_TRAINER.SUCCESS: {
      let insertedItem = selectn('action.insertedItem', action);
      insertedItem.trainerId = selectn(
        'payload.result.handlerResult.trainerId',
        action,
      );

      return insertedItem.trainerId
        ? { ...state, results: [...state.results, insertedItem] }
        : state;
    }
    case UPDATE_TRAINER_INFO.FAILURE:
    case HIRE_TRAINER.FAILURE: {
      return state;
    }
    case ARCHIVE_TRAINER.SUCCESS: {
      let update = selectn('action.update', action);
      return {
        ...state,
        results: state.results.map(x => {
          if (x.trainerId === update.trainerId) {
            return {
              ...x,
              archived: !x.archived,
            };
          }
          return x;
        }),
      };
    }
    case UPDATE_TRAINER_INFO.SUCCESS: {
      let update = selectn('action.update', action);

      return {
        ...state,
        results: state.results.map(x => {
          if (x.trainerId === update.trainerId) {
            return {
              ...x,
              color: update.color,
              birthDate: update.birthDate,
            };
          }
          return x;
        }),
      };
    }

    case UPDATE_DEFAULT_TRAINER_CLIENT_RATE.SUCCESS: {
      let update = selectn('action.update', action);

      return {
        ...state,
        results: state.results.map(x => {
          if (x.trainerId === update.trainerId) {
            return {
              ...x,
              defaultTrainerClientRate: update.defaultTrainerClientRate,
            };
          }
          return x;
        }),
      };
    }

    case UPDATE_TRAINER_PASSWORD.SUCCESS: {
      // don't store the password in state
      return state;
    }

    case UPDATE_TRAINER_CONTACT.SUCCESS: {
      let update = selectn('action.update', action);

      return {
        ...state,
        results: state.results.map(x => {
          if (x.trainerId === update.trainerId) {
            return {
              ...x,
              contact: {
                ...x.contact,
                secondaryPhone: update.secondaryPhone,
                mobilePhone: update.mobilePhone,
                email: update.email,
                firstName: update.firstName,
                lastName: update.lastName,
              },
            };
          }
          return x;
        }),
      };
    }

    case UPDATE_TRAINER_ADDRESS.SUCCESS: {
      let update = selectn('action.update', action);

      return {
        ...state,
        results: state.results.map(x => {
          if (x.trainerId === update.trainerId) {
            return {
              ...x,
              contact: {
                ...x.contact,
                address: {
                  ...x.contact.address,
                  street1: update.street1,
                  street2: update.street2,
                  city: update.city,
                  state: update.state,
                  zipCode: update.zipCode,
                },
              },
            };
          }
          return x;
        }),
      };
    }

    case UPDATE_TRAINER_CLIENTS.SUCCESS: {
      let update = selectn('action.update', action);

      return {
        ...state,
        results: state.results.map(x => {
          if (x.trainerId === update.trainerId) {
            return {
              ...x,
              clients: update.clients,
            };
          }
          return x;
        }),
      };
    }

    case UPDATE_TRAINER_CLIENT_RATES.SUCCESS: {
      let update = selectn('action.update', action);
      return {
        ...state,
        results: state.results.map(x => {
          if (x.trainerId === update.trainerId) {
            return {
              ...x,
              trainerClientRates: update.clientRates,
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

export function updateTrainerInfo(data) {
  const item = {
    trainerId: data.trainerId,
    birthDate: data.birthDate,
    color: data.color,
  };

  return {
    type: UPDATE_TRAINER_INFO.REQUEST,
    states: UPDATE_TRAINER_INFO,
    url: config.apiBase + 'trainer/updateTrainerInfo',
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

export function updateDefaultTrainerClientRate(data) {
  const item = {
    trainerId: data.trainerId,
    defaultTrainerClientRate: data.defaultTrainerClientRate,
    color: data.color,
  };

  return {
    type: UPDATE_DEFAULT_TRAINER_CLIENT_RATE.REQUEST,
    states: UPDATE_DEFAULT_TRAINER_CLIENT_RATE,
    url: config.apiBase + 'trainer/updateDefaultTrainerClientRate',
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

export function updateTrainerPassword(data) {
  const item = {
    trainerId: data.trainerId,
    password: data.password,
  };
  return {
    type: UPDATE_TRAINER_PASSWORD.REQUEST,
    states: UPDATE_TRAINER_PASSWORD,
    url: config.apiBase + 'trainer/updateTrainerPassword',
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

export function updateTrainerContact(data) {
  const item = {
    trainerId: data.trainerId,
    secondaryPhone: data.secondaryPhone,
    mobilePhone: data.mobilePhone,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
  };
  return {
    type: UPDATE_TRAINER_CONTACT.REQUEST,
    states: UPDATE_TRAINER_CONTACT,
    url: config.apiBase + 'trainer/updateTrainerContact',
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

export function updateTrainerAddress(data) {
  const item = {
    trainerId: data.trainerId,
    street1: data.street1,
    street2: data.street2,
    city: data.city,
    state: data.state ? data.state.value : undefined,
    zipCode: data.zipCode,
  };
  return {
    type: UPDATE_TRAINER_ADDRESS.REQUEST,
    states: UPDATE_TRAINER_ADDRESS,
    url: config.apiBase + 'trainer/updateTrainerAddress',
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

export function updateTrainersClients(data) {
  const item = {
    trainerId: data.trainerId,
    clients: data.clients,
  };

  return {
    type: UPDATE_TRAINER_CLIENTS.REQUEST,
    states: UPDATE_TRAINER_CLIENTS,
    url: config.apiBase + 'trainer/updateTrainersClients',
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

const successFunction = (action, payload) => {
  browserHistory.push('/trainers');
  return {
    type: action.states.SUCCESS,
    action,
    payload,
  };
};

export function hireTrainer(data) {
  const trainer = denormalizeTrainer(data);
  return {
    type: HIRE_TRAINER.REQUEST,
    states: HIRE_TRAINER,
    url: config.apiBase + 'trainer/hireTrainer',
    insertedItem: trainer,
    successFunction,
    params: {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trainer),
    },
  };
}

export function archiveTrainer(data) {
  return {
    type: ARCHIVE_TRAINER.REQUEST,
    states: ARCHIVE_TRAINER,
    url: config.apiBase + 'trainer/archiveTrainer',
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

export function fetchTrainerAction(trainerId) {
  let apiUrl = config.apiBase + 'trainer/getTrainer/' + trainerId;
  return {
    type: TRAINER.REQUEST,
    states: TRAINER,
    url: apiUrl,
    params: {
      method: 'GET',
      credentials: 'include',
    },
  };
}
// put paging sorting etc params here
export function fetchAllTrainersAction() {
  let apiUrl = config.apiBase + 'fetchAllTrainers';
  return {
    type: TRAINER_LIST.REQUEST,
    states: TRAINER_LIST,
    url: apiUrl,
    params: {
      method: 'GET',
      credentials: 'include',
    },
  };
}

export function fetchTrainersAction() {
  let apiUrl = config.apiBase + 'fetchTrainers';
  return {
    type: TRAINER_LIST.REQUEST,
    states: TRAINER_LIST,
    url: apiUrl,
    params: {
      method: 'GET',
      credentials: 'include',
    },
  };
}
