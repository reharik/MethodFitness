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
import TrainerVerificationListContainer from './containers/lists/TrainerVerificationListContainer';
import PayTrainerListContainer from './containers/lists/PayTrainerListContainer';
import TrainerPaymentListContainer from './containers/lists/TrainerPaymentListContainer';
import TrainerPaymentDetailsContainer from './containers/lists/TrainerPaymentDetailsListContainer';
import LocationList from './containers/lists/LocationListContainer';
import UpdateLocationContainer from './containers/forms/UpdateLocationContainer';
import LocationContainer from './containers/forms/LocationContainer';

const routes = (
  <Route path="/" component={AppContainer}>
    <IndexRoute component={Calendar} />
    <Route path="/calendar" component={Calendar} />
    <Route path="/trainers" component={TrainersList} />
    <Route path="/trainer" component={TrainerContainer} />
    <Route path="/trainer/:trainerId" component={UpdateTrainerContainer} />
    <Route path="/clients" component={ClientList} />
    <Route path="/client/:clientId" component={UpdateClientContainer} />
    <Route path="/client" component={ClientContainer} />
    <Route path="/locations" component={LocationList} />
    <Route path="/location/:locationId" component={UpdateLocationContainer} />
    <Route path="/location" component={LocationContainer} />
    <Route path="/purchase(/:clientId)" component={PurchaseContainer} />
    <Route path="/purchases(/:clientId)" component={PurchaseListContainer} />
    <Route path="/verification" component={TrainerVerificationListContainer} />
    <Route
      path="/payTrainer(/:trainerId)"
      component={PayTrainerListContainer}
    />
    <Route path="/trainerPayments" component={TrainerPaymentListContainer} />
    <Route
      path="/trainerPayment(/:paymentId)"
      component={TrainerPaymentDetailsContainer}
    />
  </Route>
);

export default routes;
