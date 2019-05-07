import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UpdateClientForm from '../../components/forms/UpdateClientForms/UpdateClientForm';
import normalizeModel from '../../utilities/normalizeModel';
import states from './../../constants/states';
import sources from './../../constants/sources';
import {
  updateClientInfo,
  updateClientAddress,
  updateClientContact,
  updateClientSource,
  updateClientRates,
  fetchClientAction,
} from './../../modules/clientModule';
import { notifications } from './../../modules/notificationModule';

import { actions as notifActions } from 'redux-notifications';
const { notifClear } = notifActions;

class UpdateClientFormContainer extends Component {
  UNSAFE_componentWillMount() {
    this.loadData();
  }

  loadData() {
    if (this.props.match.params.clientId) {
      this.props.fetchClientAction(this.props.match.params.clientId);
    }
  }

  render() {
    if (this.props.isFetching) {
      return <p style={{ 'padding-top': '100px' }}> Loading... </p>;
    }
    if (this.props.errorMessage) {
      return (
        <p style={{ 'padding-top': '100px' }}>
          ERROR! -&gt; {this.props.errorMessage}
        </p>
      );
    }

    return <UpdateClientForm {...this.props} />;
  }
}

UpdateClientFormContainer.propTypes = {
  params: PropTypes.object,
  fetchClientAction: PropTypes.func,
  isFetching: PropTypes.func,
  errorMessage: PropTypes.string,
  match: PropTypes.object
};

const mapStateToProps = (state, props) => {
  const client = state.clients.results.find(
    x => x.clientId === props.match.params.clientId,
  );
  const model = normalizeModel(state.schema.definitions.client, client);
  console.log(`==========model==========`);
  console.log(client ? client.inventory : null);
  console.log(`==========END model==========`);

  return {
    model,
    states,
    sources,
    inventory: client ? client.inventory : null,
    clientId: client ? client.clientId : null,
    isAdmin: state.auth.user.role === 'admin',
  };
};

export default connect(
  mapStateToProps,
  {
    updateClientInfo,
    updateClientAddress,
    updateClientContact,
    updateClientSource,
    updateClientRates,
    fetchClientAction,
    notifications,
    notifClear,
  },
)(UpdateClientFormContainer);
