import config from './../utilities/configValues';
import { browserHistory } from 'react-router';
import selectn from 'selectn';
import reducerMerge from './../utilities/reducerMerge';
import { requestStates } from '../sagas/requestSaga';

export const ADD_LOCATION = requestStates('add_location', 'location');
export const UPDATE_LOCATION = requestStates('update_location', 'location');

export const ARCHIVE_LOCATION = requestStates('archive_location', 'location');
export const LOCATION_LIST = requestStates('location_list', 'location');
export const LOCATION = requestStates('location');

export default (state = [], action = {}) => {
  switch (action.type) {
    case LOCATION.REQUEST: {
      return state;
    }
    case LOCATION.SUCCESS: {
      return reducerMerge(state, action.response, 'locationId');
    }
    case LOCATION_LIST.SUCCESS: {
      return reducerMerge(state, action.response.locations, 'locationId');
    }
    case ADD_LOCATION.SUCCESS: {
      let insertedItem = selectn('action.insertedItem', action);
      insertedItem.locationId = selectn(
        'payload.result.handlerResult.locationId',
        action,
      );
      return insertedItem.locationId ? [...state, insertedItem] : state;
    }
    case UPDATE_LOCATION.FAILURE:
    case ADD_LOCATION.FAILURE: {
      return state;
    }

    case ARCHIVE_LOCATION.SUCCESS: {
      let update = selectn('action.update', action);
      return state.map(x => {
        if (x.locationId === update.locationId) {
          return {
            ...x,
            archived: !update.archived,
          };
        }
        return x;
      });
    }

    case UPDATE_LOCATION.SUCCESS: {
      let update = selectn('action.update', action);

      return state.map(x => {
        if (x.locationId === update.locationId) {
          return {
            ...x,
            name: update.name,
          };
        }
        return x;
      });
    }

    default: {
      return state;
    }
  }
};

export function updateLocation(data) {
  const item = {
    locationId: data.locationId,
    name: data.name,
  };
  return {
    type: UPDATE_LOCATION.REQUEST,
    states: UPDATE_LOCATION,
    url: config.apiBase + 'location/updateLocation',
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
  browserHistory.push('/locations');
  return {
    type: action.states.SUCCESS,
    action,
    payload,
  };
};

export function addLocation(data) {
  return {
    type: ADD_LOCATION.REQUEST,
    states: ADD_LOCATION,
    url: config.apiBase + 'location/addLocation',
    insertedItem: data,
    successFunction,
    containerName: 'locationForm',
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

export function archiveLocation(data) {
  return {
    type: ARCHIVE_LOCATION.REQUEST,
    states: ARCHIVE_LOCATION,
    url: config.apiBase + 'location/archiveLocation',
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

export function fetchLocationAction(locationId) {
  let apiUrl = config.apiBase + 'location/getLocation/' + locationId;
  return {
    type: LOCATION.REQUEST,
    states: LOCATION,
    url: apiUrl,
    params: {
      method: 'GET',
      credentials: 'include',
    },
  };
}

export function fetchAllLocationsAction() {
  let apiUrl = config.apiBase + 'fetchAllLocations';
  return {
    type: LOCATION_LIST.REQUEST,
    states: LOCATION_LIST,
    url: apiUrl,
    params: {
      method: 'GET',
      credentials: 'include',
    },
  };
}
