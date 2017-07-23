import config from './../utilities/configValues';
import { browserHistory } from 'react-router';
import { denormalizeTrainer } from './../utilities/denormalize';
import selectn from 'selectn';
import reducerMerge from './../utilities/reducerMerge';
import { requestStates } from '../sagas/requestSaga';

export const HIRE_TRAINER = requestStates('hire_trainer', 'trainer');
export const UPDATE_TRAINER_PASSWORD = requestStates('update_trainer_password', 'trainer');
export const UPDATE_TRAINER_CONTACT = requestStates('update_trainer_contact', 'trainer');
export const UPDATE_TRAINER_ADDRESS = requestStates('update_trainer_address', 'trainer');
export const UPDATE_TRAINER_CLIENTS = requestStates('update_trainer_clients', 'trainer');
export const UPDATE_TRAINER_CLIENT_RATES = requestStates('update_trainer_client_rates', 'trainer');
export const UPDATE_TRAINER_INFO = requestStates('update_trainer_info', 'trainer');
export const TRAINER_LIST = requestStates('trainer_list', 'trainer');
export const ARCHIVE_TRAINER = requestStates('archive_trainer', 'trainer');
export const TRAINER = requestStates('trainer');

export default (state = [], action = {}) => {
  switch (action.type) {
    case HIRE_TRAINER.REQUEST:
    case TRAINER.REQUEST:
    case TRAINER_LIST.REQUEST: {
      console.log('HIRE_TRAINER_REQUEST');
      return state;
    }
    case TRAINER.SUCCESS: {
      return reducerMerge(state, action.response);
    }
    case TRAINER_LIST.SUCCESS: {
      return reducerMerge(state, action.response.trainers);
    }
    case HIRE_TRAINER.SUCCESS: {
      let insertedItem = selectn('action.insertedItem', action);
      insertedItem.id = selectn('payload.result.handlerResult.trainerId', action);

      return insertedItem.id ? [...state, insertedItem] : state;
    }
    case UPDATE_TRAINER_INFO.FAILURE:
    case HIRE_TRAINER.FAILURE: {
      return state;
    }
    case ARCHIVE_TRAINER.SUCCESS: {
      let update = selectn('action.update', action);
      return state.map(x => {
        if (x.id === update.id) {
          return {
            ...x,
            archived: !x.archived
          };
        }
        return x;
      });
    }
    case UPDATE_TRAINER_INFO.SUCCESS: {
      let update = selectn('action.update', action);

      return state.map(x => {
        if (x.id === update.id) {
          return {
            ...x,
            color: update.color,
            birthDate: update.birthDate,
            contact: { ...x.contact, firstName: update.firstName, lastName: update.lastName }
          };
        }
        return x;
      });
    }

    case UPDATE_TRAINER_PASSWORD.SUCCESS: {
      // don't store the password in state
      return state;
    }

    case UPDATE_TRAINER_CONTACT.SUCCESS: {
      let update = selectn('action.update', action);

      return state.map(x => {
        if (x.id === update.id) {
          return {
            ...x,
            contact: {
              ...x.contact,
              secondaryPhone: update.secondaryPhone,
              mobilePhone: update.mobilePhone,
              email: update.email
            }
          };
        }
        return x;
      });
    }

    case UPDATE_TRAINER_ADDRESS.SUCCESS: {
      let update = selectn('action.update', action);

      return state.map(x => {
        if (x.id === update.id) {
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
                zipCode: update.zipCode
              }
            }
          };
        }
        return x;
      });
    }

    case UPDATE_TRAINER_CLIENTS.SUCCESS: {
      let update = selectn('action.update', action);

      return state.map(x => {
        if (x.id === update.id) {
          return { ...x, clients: update.clients };
        }
        return x;
      });
    }

    case UPDATE_TRAINER_CLIENT_RATES.SUCCESS: {
      let update = selectn('action.update', action);
      console.log(`==========update=========`);
      console.log(update);
      console.log(`==========END update=========`);
      return state.map(x => {
        if (x.id === update.id) {
          return { ...x, trainerClientRates: update.clientRates };
        }
        return x;
      });
    }

    default: {
      return state;
    }
  }
};

export function updateTrainerInfo(data) {
  const item = {
    id: data.id,
    birthDate: data.birthDate,
    color: data.color,
    firstName: data.firstName,
    lastName: data.lastName
  };

  return {
    type: UPDATE_TRAINER_INFO.REQUEST,
    states: UPDATE_TRAINER_INFO,
    url: config.apiBase + 'trainer/updateTrainerInfo',
    update: data,
    params: {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    }
  };
}

export function updateTrainerPassword(data) {
  const item = {
    id: data.id,
    password: data.password
  };
  return {
    type: UPDATE_TRAINER_PASSWORD.REQUEST,
    states: UPDATE_TRAINER_PASSWORD,
    url: config.apiBase + 'trainer/updateTrainerPassword',
    params: {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    }
  };
}

export function updateTrainerContact(data) {
  const item = {
    id: data.id,
    secondaryPhone: data.secondaryPhone,
    mobilePhone: data.mobilePhone,
    email: data.email
  };
  return {
    type: UPDATE_TRAINER_CONTACT.REQUEST,
    states: UPDATE_TRAINER_CONTACT,
    url: config.apiBase + 'trainer/updateTrainerContact',
    update: data,
    params: {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    }
  };
}

export function updateTrainerAddress(data) {
  const item = {
    id: data.id,
    street1: data.street1,
    street2: data.street2,
    city: data.city,
    state: data.state ? data.state.value : undefined,
    zipCode: data.zipCode
  };
  return {
    type: UPDATE_TRAINER_ADDRESS.REQUEST,
    states: UPDATE_TRAINER_ADDRESS,
    url: config.apiBase + 'trainer/updateTrainerAddress',
    update: data,
    params: {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    }
  };
}

export function updateTrainersClientRate(data) {
  const item = {
    id: data.id,
    clientRates: data.clientRates
  };

  return {
    type: UPDATE_TRAINER_CLIENT_RATES.REQUEST,
    states: UPDATE_TRAINER_CLIENT_RATES,
    url: config.apiBase + 'trainer/updateTrainersClientRates',
    update: data,
    params: {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    }
  };
}

export function updateTrainersClients(data) {
  const item = {
    id: data.id,
    clients: data.clients
  };

  return {
    type: UPDATE_TRAINER_CLIENTS.REQUEST,
    states: UPDATE_TRAINER_CLIENTS,
    url: config.apiBase + 'trainer/updateTrainersClients',
    update: data,
    params: {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    }
  };
}

const successFunction = (action, payload) => {
  browserHistory.push('/trainers');
  return { type: action.states.SUCCESS, action, payload };
};

export function hireTrainer(data) {
  data.state = data.state ? data.state.value : undefined;
  data.clients = data.clients ? data.clients.map(x => x.value) : [];
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trainer)
    }
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }
  };
}

export function fetchTrainerAction(id) {
  let apiUrl = config.apiBase + 'trainer/getTrainer/' + id;
  return {
    type: TRAINER.REQUEST,
    states: TRAINER,
    url: apiUrl,
    params: {
      method: 'GET',
      credentials: 'include'
    }
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
      credentials: 'include'
    }
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
      credentials: 'include'
    }
  };
}
