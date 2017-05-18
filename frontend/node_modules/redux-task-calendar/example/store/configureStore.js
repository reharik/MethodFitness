
import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';

import calendarReducers from './../reducers';
import DevTools from '../components/DevTools';
import {reducer as formReducer} from 'redux-form';

export default function configureStore(initialState) {
  const store = createStore(
        calendarReducers,
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
