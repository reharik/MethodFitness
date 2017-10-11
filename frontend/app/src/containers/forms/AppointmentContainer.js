import { connect } from 'react-redux';
import AppointmentForm from '../../components/forms/Appointment/AppointmentForm';
import { notifications } from './../../modules/notificationModule';
import appointmentTypes from './../../constants/appointmentTypes';
import { generateAllTimes } from './../../utilities/appointmentTimes';
import { appointmentModel, updateAppointmentModel } from './../../selectors/appointmentModelSelector';
import { scheduleAppointment,
  scheduleAppointmentInPast,
  updateAppointment,
  updateAppointmentFromPast,
  fetchAppointmentAction,
  deleteAppointment,
  deleteAppointmentFromPast} from './../../modules/appointmentModule';
import { permissionToSetAppointment } from './../../utilities/appointmentTimes';


const mapStateToProps = (state, ownProps) => {
  const isAdmin = state.auth.user.role === 'admin';
  let user = state.trainers.find(x => x.trainerId === state.auth.user.trainerId);
  const clients = state.clients
    .filter(x => !x.archived)
    .filter(x => isAdmin || user.clients.includes(x.clientId))
    .map(x => ({value: x.clientId, display: `${x.contact.lastName} ${x.contact.firstName}`}));

  const trainers = state.trainers
    .filter(x => !x.archived)
    .map(x => ({value: x.trainerId, display: `${x.contact.lastName} ${x.contact.firstName}`, color: x.color}));

  // please put this shit in a config somewhere
  const times = generateAllTimes(15, 7, 7);

  const model = !ownProps.args.appointmentId
    ? appointmentModel(state, ownProps.args)
    : updateAppointmentModel(state, ownProps.args, ownProps.isCopy);

  let buttons;
  if (ownProps.args.appointmentId && !ownProps.isCopy && !ownProps.isEdit) {
    buttons = ['copy', 'delete', 'cancel'];
    if (permissionToSetAppointment({date: model.date.value, startTime: model.startTime.value}, isAdmin)) {
      buttons.splice(1, 0, 'edit');
    }
  } else {
    buttons = ['submit', 'cancel'];
  }

  model.appointmentType.label = 'Type';
  model.trainerId.label = 'Trainer';
  return {
    isAdmin,
    model,
    clients,
    trainers,
    appointmentTypes,
    times,
    onCancel: ownProps.onCancel,
    onCopy: ownProps.onCopy,
    onEdit: ownProps.onEdit,
    buttons,
    editing: !model.appointmentId.value || ownProps.isEdit,
    trainerId: user.trainerId
  };
};

export default connect(mapStateToProps, {
  scheduleAppointment,
  scheduleAppointmentInPast,
  updateAppointment,
  fetchAppointmentAction,
  notifications,
  deleteAppointment,
  deleteAppointmentFromPast,
  updateAppointmentFromPast
})(AppointmentForm);
