import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import appReducer from '../modules/rootReducer';
import DevTools from '../containers/DevTools';
//thunk used for notif
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './../sagas/rootSaga';
import { cacheEnhancer } from 'redux-cache';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';

export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState) {
  const store = createStore(
    appReducer(history),
    initialState,
    compose(
      applyMiddleware(routerMiddleware(history), thunk, sagaMiddleware, logger),
      cacheEnhancer(),
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
