import React from 'react';
import PropTypes from 'prop-types';
import NavigationContainer from './../../containers/MenuContainer';
import Header from './../../containers/HeaderContainer';
import { Layout } from 'antd';
import { Route, Switch } from 'react-router-dom';
import Calendar from '../../containers/CalendarContainer';
import TrainersList from '../../containers/lists/TrainerListContainer';
import TrainerContainer from '../../containers/forms/TrainerContainer';
import UpdateTrainerContainer from '../../containers/forms/UpdateTrainerContainer';
import ClientList from '../../containers/lists/ClientListContainer';
import UpdateClientContainer from '../../containers/forms/UpdateClientContainer';
import ClientContainer from '../../containers/forms/ClientContainer';
import LocationList from '../../containers/lists/LocationListContainer';
import UpdateLocationContainer from '../../containers/forms/UpdateLocationContainer';
import LocationContainer from '../../containers/forms/LocationContainer';
import PurchaseContainer from '../../containers/forms/PurchaseContainer';
import PurchaseListContainer from '../../containers/lists/PurchaseListContainer';
import TrainerVerificationListContainer from '../../containers/lists/TrainerVerificationListContainer';
import PayTrainerListContainer from '../../containers/lists/PayTrainerListContainer';
import TrainerPaymentListContainer from '../../containers/lists/TrainerPaymentListContainer';
import TrainerPaymentDetailsContainer from '../../containers/lists/TrainerPaymentDetailsListContainer';
import UpdateDefaultClientRatesContainer from '../../containers/forms/UpdateDefaultClientRatesContainer';

const { Content, Sider } = Layout;

const _Layout = ({ isReady, userRole }) => {
  if (!isReady) {
    return null;
  }
  return (
    <Layout style={{ height: '100%' }}>
      <Header />
      <Layout>
        <Sider
          breakpoint="sm"
          collapsible={true}
          style={{
            overflow: 'hidden',
            background: '#f2f2f2',
          }}
        >
          <NavigationContainer />
        </Sider>
        <Layout
          style={{
            padding: '0 0 24px',
            background: '#f2f2f2',
          }}
        >
          <Content
            style={{
              paddingRight: 24,
              margin: 0,
              minHeight: '100%',
            }}
          >
            <Switch>
            <Route exact path="/" component={Calendar} />
            <Route path="/calendar" component={Calendar} />
            <Route path="/clients" component={ClientList} />
            <Route path="/client/:clientId" component={UpdateClientContainer} />
            <Route path="/client" component={ClientContainer} />
            <Route
              path="/verification"
              component={TrainerVerificationListContainer}
            />
              <Route
                exact
                path="/purchase/:clientId"
                component={PurchaseContainer}
              />
              <Route exact path="/purchase" component={PurchaseContainer} />
              <Route
                exact
                path="/purchases/:clientId"
                component={PurchaseListContainer}
              />
              <Route
                exact
                path="/purchases"
                component={PurchaseListContainer}
              />
              <Route
                exact
                path="/trainerPayments/:trainerId"
                component={TrainerPaymentListContainer}
              />
              <Route
                exact
                path="/trainerPayments"
                component={TrainerPaymentListContainer}
              />
              <Route
                exact
                path="/trainerPaymentDetails/:paymentId/:trainerId"
                component={TrainerPaymentDetailsContainer}
              />
              <Route
                exact
                path="/trainerPaymentDetails/:paymentId"
                component={TrainerPaymentDetailsContainer}
              />

            {userRole === 'admin' ? (
              <Switch>

              <Route
                    path="/payTrainer/:trainerId"
                    component={PayTrainerListContainer}
                  />
                  <Route
                    path="/payTrainer"
                    component={PayTrainerListContainer}
                  />
                <Route
                  path="/defaultClientRates"
                  component={UpdateDefaultClientRatesContainer}
                />
                <Route path="/trainers" component={TrainersList} />
                <Route
                  path="/trainer/:trainerId"
                  component={UpdateTrainerContainer}
                />
                <Route path="/trainer" component={TrainerContainer} />
                <Route
                  path="/location/:locationId"
                  component={UpdateLocationContainer}
                />
                <Route path="/locations" component={LocationList} />
                <Route path="/location" component={LocationContainer} />
              </Switch>

            ) : null}
            </Switch>

          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

_Layout.propTypes = {
  isReady: PropTypes.bool,
  userRole: PropTypes.string,
};

export default _Layout;
