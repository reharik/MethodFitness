import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import PurchaseForm from '../../components/forms/PurchaseForm';
import formJsonSchema from '../../utilities/formJsonSchema';
import { purchase } from './../../modules/purchaseModule';
import { notifications }  from './../../modules/notificationModule';
import {fetchClientAction } from './../../modules/clientModule'

const mapStateToProps = (state, props) => {
  const model = formJsonSchema(state.schema.definitions.purchase);
  model.clientId.value = props.params.clientId;
  let client = state.clients.find(x=>x.id === props.params.clientId) || {contact:{}};

  return {
    model,
    client
  }
};

export default connect(mapStateToProps, { purchase,
  notifications,
  fetchClientAction})(PurchaseForm);
