import React, { Component } from 'react';
import { connect } from 'react-redux';
import UpdateClientForm from '../../components/forms/UpdateClientForm';
import formJsonSchema from '../../utilities/formJsonSchema';
import states from './../../constants/states';
import sources from './../../constants/sources';
import {
  updateClientInfo,
  updateClientAddress,
  updateClientContact,
  updateClientSource,
  fetchClientAction
} from './../../modules/clientModule';
import { notifications } from './../../modules/notificationModule';

import { actions as notifActions } from 'redux-notifications';
const { notifClear } = notifActions;

class UpdateClientFormContainer extends Component {
  componentWillMount() {
    this.loadData();
  }

  loadData() {
    if (this.props.params.clientId) {
      this.props.fetchClientAction(this.props.params.clientId);
    }
  }

  render() {
    if (this.props.isFetching) {
      return <p style={{ 'padding-top': '100px' }}> Loading... </p>;
    }
    if (this.props.errorMessage) {
      return <p style={{ 'padding-top': '100px' }}>ERROR! -&gt; {this.props.errorMessage}</p>;
    }

    return <UpdateClientForm {...this.props} />;
  }
}

const mapStateToProps = (state, props) => {
  const client = state.clients.find(x => x.id === props.params.clientId);
  const model = formJsonSchema(state.schema.definitions.client, client);

  return {
    model,
    states,
    sources,
    inventory: client ? client.inventory : null
  };
};

export default connect(mapStateToProps, {
  updateClientInfo,
  updateClientAddress,
  updateClientContact,
  updateClientSource,
  fetchClientAction,
  notifications,
  notifClear
})(UpdateClientFormContainer);
