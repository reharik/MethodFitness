import React from 'react';
import { render } from 'react-dom';
import configureStore from './store/configureStore';
import { Provider } from 'react-redux';
import App from './components/App';
import '../src/css/index.css';
import './css/app.css';


	// var init = {
	// tasks: [
	// 	{
	// 		display: "fuck you!",
	// 		startTime: momentFromTime('8:00 AM'),
	// 		endTime:	momentFromTime("9:00 AM"),
	// 		date: moment(),
	// 		id: uuid.v4(),
	// 		color: 'red',
	// 		slots: 4
	// 	},
	// 	{
	// 		display: "fuck you!",
	// 		startTime: momentFromTime('8:30 AM'),
	// 		endTime:	momentFromTime("9:30 AM"),
	// 		date: moment(),
	// 		id: uuid.v4(),
	// 		color: 'blue',
	// 		slots: 4
	// 	},
	// 	{
	// 		display: "fuck you!",
	// 		startTime: momentFromTime('8:30 AM'),
	// 		endTime:	momentFromTime("9:30 AM"),
	// 		date: moment(),
	// 		id: uuid.v4(),
	// 		color: 'blue',
	// 		slots: 4
	// 	},
	// 	{
	// 		display: "fuck you!",
	// 		startTime: momentFromTime('8:30 AM'),
	// 		endTime:	momentFromTime("9:30 AM"),
	// 		date: moment(),
	// 		id: uuid.v4(),
	// 		color: 'blue',
	// 		slots: 4
	// 	},
	// 	{
	// 		display: "fuck you!",
	// 		startTime: momentFromTime('8:30 AM'),
	// 		endTime:	momentFromTime("9:30 AM"),
	// 		date: moment(),
	// 		id: uuid.v4(),
	// 		color: 'blue',
	// 		slots: 4
	// 	},
	// 	{
	// 		display: "fuck you!",
	// 		startTime: momentFromTime('8:30 AM'),
	// 		endTime:	momentFromTime("9:30 AM"),
	// 		date: moment(),
	// 		id: uuid.v4(),
	// 		color: 'blue',
	// 		slots: 4
	// 	},
	// 	{
	// 		display: "fuck you!",
	// 		startTime: momentFromTime('8:30 AM'),
	// 		endTime:	momentFromTime("9:30 AM"),
	// 		date: moment(),
	// 		id: uuid.v4(),
	// 		color: 'blue',
	// 		slots: 4
	// 	},
	// 	// {
	// 	// 	display: "fuck you!",
	// 	// 	startTime: '8:00 AM',
	// 	// 	endTime:	"9:00 AM",
	// 	// date: new Date()
	// 	// },
	// 	// {
	// 	// 	display: "fuck you!",
	// 	// 	startTime: '8:00 AM',
	// 	// 	endTime:	"9:00 AM",
	// 	// date: new Date()
	// 	// },
	// 	{
	// 		display: "fuck you!",
	// 		startTime: momentFromTime('8:00 AM'),
	// 		endTime:	momentFromTime("9:00 AM"),
	// 		date: moment(),
	// 		id: uuid.v4(),
	// 		color: 'green',
	// 		slots: 4
	// 	}
	// ]
	// };

const store = configureStore();

render(
	<Provider store={store}>
		<App dispatch={store.dispatch} />
	</Provider>, document.getElementById('app'));

