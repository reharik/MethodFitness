import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import Root from './containers/Root';
import configureStore from './store/configureStore';

import './css/index.css';
import './css/thirdParty/redux-task-calendar.css';
import './css/thirdParty/input-color.css';
import './css/thirdParty/notif-styles.css';

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(<Root store={store} history={history} />, document.getElementById('root'));
