
import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';


import tableReducers from './../reducers';
import DevTools from '../components/DevTools';


export default function configureStore(initialState) {
  const store = createStore(
        tableReducers,
        initialState,
        compose(
            applyMiddleware(createLogger()),
            DevTools.instrument()
        )
    );

  if (module.hot) {
        // Enable Webpack hot module replacement for calendarReducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
