import React from 'react';
import { render } from 'react-dom';
import configureStore from './store/configureStore';
import { Provider } from 'react-redux';
import App from './components/App';
import './../src/css/index.css';
import './css/app.css';
import uuid from 'uuid';

const testData = [
  {
    firstName:'Raif', age:33, lastName:'Harik', email:'f@u.com', id:uuid.v4()
  },
  {
    firstName:'Robbie', age: 66, lastName:'Fuentes', email:'robbie@fuenties.com', id:uuid.v4()
  }
];

const initialState = {
  testData
}

const store = configureStore(initialState);

render(
	<Provider store={store}>
		<App dispatch={store.dispatch} />
	</Provider>, document.getElementById('app'));

