import { connect } from 'react-redux';
import moment from 'moment';
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
    .map(x => ({value: x.id, display: `${x.contact.lastName} ${x.contact.firstName}`, color: x.color}));

  // please put this shit in a config somewhere
  const times = generateAllTimes(15, 7, 7);

  const model = !ownProps.args.apptId
    ? appointmentModel(state, ownProps.args)
    : updateAppointmentModel(state, ownProps.args, ownProps.isCopy);

  const canUpdate = // isAdmin ||
    (moment(model.date).isAfter(moment(), 'day')
    || (moment(model.date).isSame(moment(), 'day')
    && moment(model.startTime, 'h:mm A').isAfter(moment().utc().subtract(2, 'hours'))));

  let buttons;
  if (ownProps.args.apptId && !ownProps.isCopy && !ownProps.isEdit) {
    buttons = ['copy', 'cancel'];
    if (canUpdate) {
      buttons.splice(1, 0, 'delete', 'edit');
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
