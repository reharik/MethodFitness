import { takeEvery, call, put, select } from 'redux-saga/effects';
import { NOTIFICATION } from './../modules/notificationModule';
import {actions as notifActions} from 'redux-notifications';
const {notifSend, notifDismiss} = notifActions;

function* notifiy(action) {

  let messages = Array.isArray(action.messages) ? action.messages : action.messages ? [action.messages] : [];

  let currentErrors = action.name
    ? yield select(state => state.notifs.filter(x => x.containerName === action.containerName && x.messageName === action.name))
    : yield select(state => state.notifs.filter(x => x.containerName === action.containerName));
  let newErrors = [];

  for (let x of messages) {
    const containerName = x.containerName || x.formName;
    const messageName = x.messageName || x.fieldName;
    const formName = x.formName || x.containerName;
    const id = containerName + '_' + messageName + '_' + x.rule;
    newErrors.push(id);
    if (!currentErrors.some(x => x.id === id)) {
      yield put(notifSend({
        id,
        containerName,
        formName,
        messageName,
        rule: x.rule,
        message: x.message,
        kind: x.level || 'danger'
      }));
    }
  }
  
  for (let x of currentErrors.filter(x => newErrors.indexOf(x.id) === -1)) {
    yield put(notifDismiss(x.id));
  }
}

export default function* () {
  yield takeEvery(action => action.type && action.type === NOTIFICATION, notifiy);
};

//TODO validate the action received by the request saga and dispatch an error if it's not valid
