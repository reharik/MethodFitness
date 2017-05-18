import React from 'react';
import { Route, IndexRoute } from 'react-router';

import AppContainer from './containers/AppContainer';
import ClientList from './containers/lists/ClientListContainer';
import TrainersList from './containers/lists/TrainerListContainer';
import Calendar from './containers/CalendarContainer';
import TrainerContainer from './containers/forms/TrainerContainer';
import UpdateTrainerContainer from './containers/forms/UpdateTrainerContainer';
import ClientContainer from './containers/forms/ClientContainer';
import UpdateClientContainer from './containers/forms/UpdateClientContainer';
import PurchaseContainer from './containers/forms/PurchaseContainer';
import PurchaseListContainer from './containers/lists/PurchaseListContainer';

const routes = (
  <Route path="/" component={AppContainer}>
    <IndexRoute component={Calendar} />
    <Route path="/calendar" component={Calendar} />
    <Route path="/trainers" component={TrainersList} />
    <Route path="/trainer" component={TrainerContainer} />
    <Route path="/trainer(/:trainerId)" component={UpdateTrainerContainer} />
    <Route path="/clients" component={ClientList} />
    <Route path="/client" component={ClientContainer} />
    <Route path="/client(/:clientId)" component={UpdateClientContainer} />
    <Route path="/purchase(/:clientId)" component={PurchaseContainer} />
    <Route path="/purchases(/:clientId)" component={PurchaseListContainer} />
  </Route>
);
module.exports = routes;
