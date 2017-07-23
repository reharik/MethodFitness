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
  fetchTrainerAction
} from './../../modules/trainerModule';
import { updateTrainersClientRate, getTrainerClientRates } from './../../modules/trainerClientRatesModule';
import { fetchClientsAction } from './../../modules/clientModule';

import { actions as notifActions } from 'redux-notifications';
const { notifClear } = notifActions;

// isn't calling mapstate to props after trc changes cuz it's fucking nested.

const mapStateToProps = (state, ownProps) => {
  const trainer = {...state.trainers.find(x => x.id === ownProps.params.trainerId)};
  const clients = state.clients
    .filter(x => !x.archived)
    .map(x => ({ value: x.id, display: `${x.contact.lastName} ${x.contact.firstName}` }));
// possibly do this backwards in case a tcr hasn't been set for some reason
  if(trainer && clients) {
    trainer.trainerClientRates = state.trainerClientRates.filter(x => x.trainerId === trainer.id).map(x => {
      let client = clients.find(c => c.value === x.clientId);
      return {
        value: x.rate,
        label: client.display || '',
        name: x.clientId,
        rule: [{required: true}]
      };
    });
  }

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
  getTrainerClientRates,
  notifClear
})(UpdateTrainerForm);
