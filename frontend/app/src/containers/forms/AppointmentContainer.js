import { connect } from 'react-redux';
import AppointmentForm from '../../components/forms/Appointment/AppointmentForm';
import { notifications } from './../../modules/notificationModule';
import appointmentTypes from './../../constants/appointmentTypes';
import { generateAllTimes } from './../../utilities/appointmentTimes';
import { appointmentModel, updateAppointmentModel } from './../../selectors/appointmentModelSelector';
import { scheduleAppointment,
  updateAppointment,
  fetchAppointmentAction,
  deleteAppointment } from './../../modules/appointmentModule';

const mapStateToProps = (state, ownProps) => {
  const isAdmin = state.auth.user.role === 'admin';
  let user = state.trainers.find(x => x.id === state.auth.user.id);

  const clients = state.clients
    .filter(x => !x.archived)
    .filter(x => isAdmin || user.clients.includes(x.id))
    .map(x => ({value: x.id, display: `${x.contact.lastName} ${x.contact.firstName}`}));

  const trainers = state.trainers
    .filter(x => !x.archived)
    .map(x => ({value: x.id, display: `${x.contact.lastName} ${x.contact.firstName}`}));

  // please put this shit in a config somewhere
  const times = generateAllTimes(15, 7, 7);

  const buttons = ownProps.args.apptId && !ownProps.isCopy && !ownProps.isEdit
    ? ['copy', 'delete', 'edit', 'cancel']
    : ['submit', 'cancel'];
  const model = !ownProps.args.apptId
    ? appointmentModel(state, ownProps.args)
    : updateAppointmentModel(state, ownProps.args, ownProps.isCopy);
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
    editing: !model.id.value || ownProps.isEdit,
    trainerId: user.id
  };
};

export default connect(mapStateToProps, {
  scheduleAppointment,
  updateAppointment,
  fetchAppointmentAction,
  notifications,
  deleteAppointment
})(AppointmentForm);
