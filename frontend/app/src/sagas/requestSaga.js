import { takeEvery, call, put } from 'redux-saga/effects';
import { logoutUser } from './../modules';

const standardSuccessResponse = (action, payload) => {
  //payload renamed to response here as it's a bit more semantic for the frontend
  return {
    type: action.states.SUCCESS,
    action,
    response: payload,
  };
};

const standardFailureResponse = (action, message, err) => {
  return {
    type: action.states.FAILURE,
    action,
    message,
    err,
  };
};

export function requestStates(entity, reducerName) {
  reducerName = reducerName || entity;
  return {
    REQUEST: `methodFit/${reducerName.toLowerCase()}/${entity.toUpperCase()}_REQUEST`,
    SUCCESS: `methodFit/${reducerName.toLowerCase()}/${entity.toUpperCase()}_SUCCESS`,
    FAILURE: `methodFit/${reducerName.toLowerCase()}/${entity.toUpperCase()}_FAILURE`,
  };
}

const handleSuccess = function* request(success, action, payload) {
  const successAction = success(action, payload);
  if (Array.isArray(successAction)) {
    for (let a of successAction) {
      yield put(a);
    }
  } else {
    const newAction = yield successAction;
    yield put(newAction);
  }
};

function* request(action) {
  let response;
  let payload;
  let headers = new Headers();
  headers.append('Accept', 'application/json, text/plain, */*');
  headers.append('Content-Type', 'application/json');
  action.params.headers = headers;
  action.params.body =
    action.params.body && typeof action.params.body !== 'string'
      ? JSON.stringify(action.params.body)
      : action.params.body;

  try {
    response = yield call(fetch, action.url, action.params);

    if (response.status === 401) {
      yield put(logoutUser());
      throw new Error('Invalid credentials. Please try to login again');
    }
    const success = action.successFunction
      ? action.successFunction
      : standardSuccessResponse;
    if (response.status === 204) {
      yield* handleSuccess(success, action);
    }
    const contentType = response.headers.get('content-type');
    payload = yield contentType && contentType.includes('json')
      ? response.json()
      : undefined;

    if (!response.ok) {
      throw new Error(response);
    }
    if (payload && payload.result && !payload.result.success) {
      throw new Error('Server was unable to complete the request');
    }

    yield* handleSuccess(success, action, payload);

    if (action.subsequentAction) {
      yield put(action.subsequentAction);
    }
  } catch (err) {
    const failure = action.failureFunction
      ? action.failureFunction
      : standardFailureResponse;
    yield put(failure(action, payload || response, err));
  }
}
// prettier-ignore
export default function* () {
  yield takeEvery(
    action => action.type && action.type.includes('REQUEST'),
    request,
  );
}

//TODO validate the action received by the request saga and dispatch an error if it's not valid
