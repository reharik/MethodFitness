import notificationSaga from './notificationSaga';
import requestSaga from './requestSaga';

export default function* rootSaga() {
  yield [requestSaga(), notificationSaga()];
}
