import config from './../utilities/configValues';
import { browserHistory } from 'react-router';
import { denormalizeClient } from './../utilities/denormalize';
import selectn from 'selectn';
import reducerMerge from './../utilities/reducerMerge';
import { requestStates } from '../sagas/requestSaga';
import { DEFAULT_KEY, generateCacheTTL } from 'redux-cache';

export const ADD_CLIENT = requestStates('add_client', 'client');
export const UPDATE_CLIENT_CONTACT = requestStates(
  'update_client_contact',
  'client',
);
export const UPDATE_CLIENT_ADDRESS = requestStates(
  'update_client_address',
  'client',
);
export const UPDATE_CLIENT_INFO = requestStates('update_client_info', 'client');
export const UPDATE_CLIENT_SOURCE = requestStates(
  'update_client_Source',
  'client',
);
export const ARCHIVE_CLIENT = requestStates('archive_client', 'client');
export const CLIENT_LIST = requestStates('client_list', 'client');
export const CLIENT = requestStates('client');

export default (state = { [DEFAULT_KEY]: null, results:[] }, action = {}) => {
  switch (action.type) {
    case CLIENT.REQUEST: {
      console.log('ADD_CLIENT_REQUEST');
      return state;
    }
    case CLIENT.SUCCESS: {
      return {...state, [DEFAULT_KEY]: generateCacheTTL(), results: reducerMerge(state.results, action.response, 'clientId')};
    }
    case CLIENT_LIST.SUCCESS: {
      return {...state, [DEFAULT_KEY]: generateCacheTTL(), results: reducerMerge(state.results, action.response.clients, 'clientId')};
    }
    case ADD_CLIENT.SUCCESS: {
      let insertedItem = selectn('action.insertedItem', action);
      insertedItem.clientId = selectn(
        'payload.result.handlerResult.clientId',
        action,
      );
      return insertedItem.clientId ? {...state, results: [...state.results, insertedItem]} : state;
    }
    case UPDATE_CLIENT_INFO.FAILURE:
    case ADD_CLIENT.FAILURE: {
      return state;
    }

    case ARCHIVE_CLIENT.SUCCESS: {
      let update = selectn('action.update', action);
      return {...state, results: state.results.map(x => {
        if (x.clientId === update.clientId) {
          return {
            ...x,
            archived: !update.archived,
          };
        }
        return x;
      })};
    }

    case UPDATE_CLIENT_INFO.SUCCESS: {
      let update = selectn('action.update', action);

      return {...state, results: state.results.map(x => {
        if (x.clientId === update.clientId) {
          return {
            ...x,
            contact: {
              ...x.contact,
              firstName: update.firstName,
              lastName: update.lastName,
            },
            birthDate: update.birthDate,
          };
        }
        return x;
      })};
    }

    case UPDATE_CLIENT_SOURCE.SUCCESS: {
      let update = selectn('action.update', action);

      return {...state, results: state.results.map(x => {
        if (x.clientId === update.clientId) {
          return {
            ...x,
            source: update.source,
            sourceNotes: update.sourceNotes,
            startDate: update.startDate,
          };
        }
        return x;
      })};
    }

    case UPDATE_CLIENT_CONTACT.SUCCESS: {
      let update = selectn('action.update', action);

      return {...state, results: state.results.map(x => {
        if (x.clientId === update.clientId) {
          return {
            ...x,
            contact: {
              ...x.contact,
              secondaryPhone: update.secondaryPhone,
              mobilePhone: update.mobilePhone,
              email: update.email,
            },
          };
        }
        return x;
      })};
    }

    case UPDATE_CLIENT_ADDRESS.SUCCESS: {
      let update = selectn('action.update', action);

      return {...state, results: state.results.map(x => {
        if (x.clientId === update.clientId) {
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
      })};
    }

    default: {
      return state;
    }
  }
};

export function updateClientInfo(data) {
  const item = {
    clientId: data.clientId,
    firstName: data.firstName,
    lastName: data.lastName,
    birthDate: data.birthDate,
  };
  return {
    type: UPDATE_CLIENT_INFO.REQUEST,
    states: UPDATE_CLIENT_INFO,
    url: config.apiBase + 'client/updateClientInfo',
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

export function updateClientContact(data) {
  const item = {
    clientId: data.clientId,
    secondaryPhone: data.secondaryPhone,
    mobilePhone: data.mobilePhone,
    email: data.email,
  };

  return {
    type: UPDATE_CLIENT_CONTACT.REQUEST,
    states: UPDATE_CLIENT_CONTACT,
    url: config.apiBase + 'client/updateClientContact',
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

export function updateClientSource(data) {
  const item = {
    clientId: data.clientId,
    source: data.source,
    sourceNotes: data.sourceNotes,
    startDate: data.startDate,
  };

  return {
    type: UPDATE_CLIENT_SOURCE.REQUEST,
    states: UPDATE_CLIENT_SOURCE,
    url: config.apiBase + 'client/updateClientSource',
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

export function updateClientAddress(data) {
  const item = {
    clientId: data.clientId,
    street1: data.street1,
    street2: data.street2,
    city: data.city,
    state: data.state ? data.state.value : undefined,
    zipCode: data.zipCode,
  };
  return {
    type: UPDATE_CLIENT_ADDRESS.REQUEST,
    states: UPDATE_CLIENT_ADDRESS,
    url: config.apiBase + 'client/updateClientAddress',
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
  browserHistory.push('/clients');
  return {
    type: action.states.SUCCESS,
    action,
    payload,
  };
};

export function addClient(data) {
  const client = denormalizeClient(data);
  data.state = data.state ? data.state.value : undefined;
  return {
    type: ADD_CLIENT.REQUEST,
    states: ADD_CLIENT,
    url: config.apiBase + 'client/addClient',
    insertedItem: client,
    successFunction,
    containerName: 'clientForm',
    params: {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(client),
    },
  };
}

export function archiveClient(data) {
  return {
    type: ARCHIVE_CLIENT.REQUEST,
    states: ARCHIVE_CLIENT,
    url: config.apiBase + 'client/archiveClient',
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

export function fetchClientAction(clientId) {
  let apiUrl = config.apiBase + 'client/getClient/' + clientId;
  return {
    type: CLIENT.REQUEST,
    states: CLIENT,
    url: apiUrl,
    params: {
      method: 'GET',
      credentials: 'include',
    },
  };
}

export function fetchAllClientsAction() {
  let apiUrl = config.apiBase + 'fetchAllClients';
  return {
    type: CLIENT_LIST.REQUEST,
    states: CLIENT_LIST,
    url: apiUrl,
    params: {
      method: 'GET',
      credentials: 'include',
    },
  };
}

export function fetchClientsAction() {
  let apiUrl = config.apiBase + 'fetchClients';
  return {
    type: CLIENT_LIST.REQUEST,
    states: CLIENT_LIST,
    url: apiUrl,
    params: {
      method: 'GET',
      credentials: 'include',
    },
  };
}
