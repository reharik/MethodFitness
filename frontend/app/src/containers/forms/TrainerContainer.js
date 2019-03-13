import { connect } from 'react-redux';
import TrainerForm from '../../components/forms/TrainerForm';
import normalizeModel from '../../utilities/normalizeModel';
import states from './../../constants/states';
import { hireTrainer, fetchTrainerAction } from './../../modules/trainerModule';
import { fetchClientsAction } from './../../modules/clientModule';
import roles from './../../constants/roles';
import { actions as notifActions } from 'redux-notifications';
const { notifClear } = notifActions;

const mapStateToProps = state => {
  const clients = state.clients.results.filter(x => !x.archived).map(x => ({
    value: x.clientId,
    display: `${x.contact.lastName}, ${x.contact.firstName}`,
  }));

  const comparePassword = form => {
    return (rule, value, callback) => {
      if (value && value !== form.getFieldValue('password')) {
        callback('Two passwords that you enter is inconsistent!');
      } else {
        callback();
      }
    };
  };

  let model = normalizeModel(state.schema.definitions.trainer);
  model.confirmPassword = { ...model.password };
  model.confirmPassword.name = 'confirmPassword';
  model.confirmPassword.label = 'Confirm Password';
  model.confirmPassword.placeholder = 'Confirm Password';
  model.confirmPassword.rules = form => [
    { required: true },
    { validator: comparePassword(form) },
  ];

  return {
    model,
    states,
    clients,
    roles,
  };
};

export default connect(
  mapStateToProps,
  {
    hireTrainer,
    fetchTrainerAction,
    fetchClientsAction,
    notifClear,
  },
)(TrainerForm);
