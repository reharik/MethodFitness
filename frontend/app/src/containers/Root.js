import React from 'react';
import PropTypes from 'prop-types';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import { Provider } from 'react-redux';
import routes from '../routes';
import DevTools from './DevTools';
import { Router } from 'react-router';

const Root = ({ store, history }) => (
  <Provider store={store}>
    <LocaleProvider locale={enUS}>
      <div style={{height: '100%'}}>
        <Router history={history} routes={routes} />
        <DevTools />
      </div>
    </LocaleProvider>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default Root;
