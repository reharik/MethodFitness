import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
import rootReducer from '../modules/rootReducer';
import DevTools from '../containers/DevTools';
//thunk used for notif
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './../sagas/rootSaga';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunk, sagaMiddleware, createLogger()),
      DevTools.instrument(),
    ),
  );

  sagaMiddleware.run(rootSaga);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
