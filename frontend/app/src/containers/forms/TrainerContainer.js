import { connect } from 'react-redux';
import TrainerForm from '../../components/forms/TrainerForm';
import normalizeModel from '../../utilities/normalizeModel';
import states from './../../constants/states';
import { hireTrainer, fetchTrainerAction } from './../../modules/trainerModule';
import { fetchClientsAction } from './../../modules/clientModule';
import roles from './../../constants/roles';
import { actions as notifActions } from 'redux-notifications';
import { notifications } from './../../modules/notificationModule';
const { notifClear } = notifActions;

const mapStateToProps = (state) => {
  const clients = state.clients
    .filter(x => !x.archived)
    .map(x => ({ value: x.id, display: `${x.contact.lastName} ${x.contact.firstName}` }));
  let model = normalizeModel(state.schema.definitions.trainer);
  model.confirmPassword = { ...model.password };
  model.confirmPassword.name = 'confirmPassword';
  // model.confirmPassword.rules = [{ rule: 'equalTo', compareField: 'password' }];
  return {
    model,
    states,
    clients,
    roles
  };
};

export default connect(mapStateToProps, {
  hireTrainer,
  fetchTrainerAction,
  fetchClientsAction,
  notifications,
  notifClear
})(TrainerForm);
