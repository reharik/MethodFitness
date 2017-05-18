import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import TrainerForm from '../../components/forms/TrainerForm';
import { Form } from 'freakin-react-forms';
import formJsonSchema from '../../utilities/formJsonSchema';
import states from './../../constants/states';
import { hireTrainer, fetchTrainerAction, HIRE_TRAINER } from './../../modules/trainerModule';
import { fetchClientsAction } from './../../modules/clientModule';
import roles from './../../constants/roles';
import { actions as notifActions } from 'redux-notifications';
import { notifications } from './../../modules/notificationModule';
const { notifClear } = notifActions;

const mapStateToProps = (state, props) => {
  const clients = state.clients
    .filter(x => !x.archived)
    .map(x => ({ value: x.id, display: `${x.contact.lastName} ${x.contact.firstName}` }));
  const jsonModel = formJsonSchema(state.schema.definitions.trainer);
  jsonModel.confirmPassword = { ...jsonModel.password };
  jsonModel.confirmPassword.name = 'confirmPassword';
  jsonModel.confirmPassword.rules = [{ rule: 'equalTo', compareField: 'password' }];
  const model = Form.buildModel('trainerForm', jsonModel);
  const ajaxState = state.ajaxState[HIRE_TRAINER.request];
  return {
    model,
    states,
    clients,
    roles,
    ajaxState
  };
};

export default connect(mapStateToProps, {
  hireTrainer,
  fetchTrainerAction,
  fetchClientsAction,
  notifications,
  notifClear
})(TrainerForm);
