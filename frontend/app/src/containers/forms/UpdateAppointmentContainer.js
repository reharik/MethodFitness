import { connect } from 'react-redux';
import UpdateAppointmentForm from '../../components/forms/UpdateAppointmentForm';
import { updateAppointment, fetchAppointmentAction, deleteAppointment } from './../../modules/appointmentModule';
import appointmentTypes from './../../constants/appointmentTypes';
import { generateAllTimes } from './../../utilities/appointmentTimes';
import { updateAppointmentModel } from './../../selectors/appointmentModelSelector';
import { actions as notifActions } from 'redux-notifications';
import { notifications } from './../../modules/notificationModule';
const { notifClear } = notifActions;

const mapStateToProps = (state, ownProps) => {
  const clients = state.clients
    .filter(x => !x.archived)
    .map(x => ({ value: x.id, display: `${x.contact.lastName} ${x.contact.firstName}` }));
  // please put this shit in a config somewhere
  const times = generateAllTimes(15, 7, 7);
  let props = {
    model: updateAppointmentModel(state, ownProps.args),
    clients,
    appointmentTypes,
    times,
    cancel: ownProps.cancel,
    isAdmin: state.auth.user.role === 'admin',
    copy: ownProps.copy,
    trainers: state.trainers.map(x => ({ value: x.id, display: `${x.contact.lastName} ${x.contact.firstName}` }))
  };

  if (!props.isAdmin) {
    let user = state.trainers.find(x => x.id === state.auth.user.id);
    let clients = !props.model.clients.value ? user.clients : user.clients.concat(props.model.clients.value);
    props.clients = props.clients.filter(x => clients.some(c => x.value === c));
  }

  return props;
};

export default connect(mapStateToProps, {
  updateAppointment,
  fetchAppointmentAction,
  notifications,
  notifClear,
  deleteAppointment
})(UpdateAppointmentForm);
