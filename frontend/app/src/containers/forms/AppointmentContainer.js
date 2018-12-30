import { connect } from 'react-redux';
import AppointmentForm from '../../components/forms/Appointment/AppointmentForm';
import { notifications } from './../../modules/notificationModule';
import appointmentTypes from './../../constants/appointmentTypes';
import { generateAllTimes } from './../../utilities/appointmentTimes';
import {
  appointmentModel,
  updateAppointmentModel,
} from './../../selectors/appointmentModelSelector';
import {
  scheduleAppointment,
  updateAppointment,
  fetchAppointmentAction,
  deleteAppointment,
  deleteAppointmentFromPast,
} from './../../modules/appointmentModule';
import { permissionToSetAppointment } from './../../utilities/appointmentTimes';
import moment from 'moment';

const mapStateToProps = (state, props) => {
  const isAdmin = state.auth.user.role === 'admin';
  // if trainers and clients aren't loaded yet don't render the whole thing
  // in functional component render check for trainer and clients
  let user;
  let trainers;
  let clients;
  let locations;
  if (
    state.trainers.length <= 0 ||
    state.clients.length <= 0 ||
    state.locations.length <= 0
  ) {
    return null;
  }
  user = state.trainers.find(x => x.trainerId === state.auth.user.trainerId);

  clients = state.clients
    .filter(x => !x.archived)
    .filter(x => isAdmin || user.clients.includes(x.clientId))
    .map(x => ({
      value: x.clientId,
      display: `${x.contact.lastName}, ${x.contact.firstName}`,
    }));

  trainers = state.trainers.filter(x => !x.archived).map(x => ({
    value: x.trainerId,
    display: `${x.contact.lastName}, ${x.contact.firstName}`,
    color: x.color,
  }));

  locations = state.locations.filter(x => !x.archived).map(x => ({
    value: x.locationId,
    display: x.name,
  }));

  const model = !props.args.appointmentId
    ? appointmentModel(state, props.args)
    : updateAppointmentModel(state, props.args, props.isCopy);

  // please put this shit in a config somewhere
  let startTime = 5;
  if (!isAdmin && model.date.value.dayOfYear() === moment().dayOfYear()) {
    startTime = moment().hour() + 1;
  }

  //set default location - this is crapy but I don't know how to deal right now
  if (!props.args.appointmentId) {
    model.locationId.value = locations[0].value;
  }

  const times = generateAllTimes(15, startTime, 11);

  let buttons;
  if (props.args.appointmentId && !props.isCopy && !props.isEdit) {
    buttons = ['copy', 'delete', 'cancel'];
    const appointment = state.appointments.filter(
      x => x.appointmentId === props.args.appointmentId,
    )[0];
    if (appointment && appointment.paid) {
      buttons = ['copy', 'cancel'];
    } else if (
      permissionToSetAppointment(
        {
          date: model.date.value,
          startTime: model.startTime.value,
        },
        isAdmin,
      )
    ) {
      buttons.splice(1, 0, 'edit');
    }
  } else {
    buttons = ['submit', 'cancel'];
  }

  model.appointmentType.label = 'Type';
  model.trainerId.label = 'Trainer';
  model.locationId.label = 'Location';

  return {
    isAdmin,
    model,
    clients,
    trainers,
    locations,
    appointmentTypes,
    times,
    onCancel: props.onCancel,
    onCopy: props.onCopy,
    onEdit: props.onEdit,
    buttons,
    editing: !model.appointmentId.value || props.isEdit,
    trainerId: user ? user.trainerId : '',
  };
};

export default connect(
  mapStateToProps,
  {
    scheduleAppointment,
    updateAppointment,
    fetchAppointmentAction,
    notifications,
    deleteAppointment,
    deleteAppointmentFromPast,
  },
)(AppointmentForm);
