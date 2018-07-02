import config from './../utilities/configValues';
import { requestStates } from '../sagas/requestSaga';

export const SCHEMA = requestStates('schema');

export default (state = { definitions: {} }, action = {}) => {
  switch (action.type) {
    case SCHEMA.SUCCESS:
      return action.response;
    default:
      return state;
  }
};

export function getJsonSchema() {
  return {
    type: SCHEMA.REQUEST,
    states: SCHEMA,
    url: config.apiBase + 'swagger',
    params: {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };
}
