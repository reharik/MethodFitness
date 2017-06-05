import { connect } from 'react-redux';
import UpdateTrainerForm from '../../components/forms/UpdateTrainerForms/UpdateTrainerForm';
import normalizeModel from './../../utilities/normalizeModel';
import states from './../../constants/states';
import roles from './../../constants/roles';
import {
  updateTrainerInfo,
  updateTrainerContact,
  updateTrainerAddress,
  updateTrainerPassword,
  updateTrainersClients,
  updateTrainersClientRate,
  fetchTrainerAction
} from './../../modules/trainerModule';
import { fetchClientsAction } from './../../modules/clientModule';
import { notifications } from './../../modules/notificationModule';

import { actions as notifActions } from 'redux-notifications';
const { notifClear } = notifActions;

const mapStateToProps = (state, ownProps) => {
  const trainer = {...state.trainers.find(x => x.id === ownProps.params.trainerId)};
  const clients = state.clients
    .filter(x => !x.archived)
    .map(x => ({ value: x.id, display: `${x.contact.lastName} ${x.contact.firstName}` }));

  trainer.trainerClientRates = (trainer.trainerClientRates || []).map( x => {
    let client = clients.find(c => c.value === x.clientId);
    return client ? {
      item: client,
      value: x.rate}
  : {};});

  const model = normalizeModel(state.schema.definitions.trainer, trainer);
  model.confirmPassword = { ...model.password };
  model.confirmPassword.name = 'confirmPassword';
  model.confirmPassword.rules = [{ rule: 'equalTo', compareField: 'password' }];
  return {
    model,
    states,
    clients,
    roles
  };
};

export default connect(mapStateToProps, {
  updateTrainerInfo,
  updateTrainerContact,
  updateTrainerAddress,
  updateTrainerPassword,
  updateTrainersClients,
  updateTrainersClientRate,
  fetchTrainerAction,
  fetchClientsAction,
  notifications,
  notifClear
})(UpdateTrainerForm);
