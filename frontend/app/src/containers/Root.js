import React from 'react';
import PropTypes from 'prop-types';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import { Provider } from 'react-redux';
import DevTools from './DevTools';
import { Route } from 'react-router-dom';
import AppContainer from './AppContainer';
import { ConnectedRouter } from 'connected-react-router';
import configureStore , { history } from './../store/configureStore';
const store = configureStore();

const Root = () => (
  <Provider store={store}>
    <LocaleProvider locale={enUS}>
      <div style={{ height: '100%' }}>
        <ConnectedRouter history={history}>
          <Route path="/" component={AppContainer} />
          </ConnectedRouter>
          <DevTools />
      </div>
    </LocaleProvider>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
