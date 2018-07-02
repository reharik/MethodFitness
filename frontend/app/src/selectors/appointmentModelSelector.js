import normalizeModel from './../utilities/normalizeModel';
import { syncApptTypeAndTime } from './../utilities/appointmentTimes';
import moment from 'moment';

export function appointmentModel(state, args) {
  moment.locale('en');
  const model = normalizeModel(state.schema.definitions.appointment);
  model.date.value = moment(args.day);
  model.appointmentType.value = 'halfHour';
  model.startTime.value = args.startTime;
  model.endTime.value = syncApptTypeAndTime(
    model.appointmentType.value,
    model.startTime.value,
  );
  model.trainerId.value = state.auth.user.trainerId;
  return model;
}

export function updateAppointmentModel(state, args, copy) {
  moment.locale('en');
  const appointment = state.appointments.filter(
    x => x.appointmentId === args.appointmentId,
  )[0];
  const model = normalizeModel(
    state.schema.definitions.appointment,
    appointment,
  );
  model.startTime.value = moment(model.startTime.value).format('hh:mm A');
  model.endTime.value = moment(model.endTime.value).format('hh:mm A');
  model.appointmentId.value = copy ? '' : model.appointmentId.value;
  return model;
}
