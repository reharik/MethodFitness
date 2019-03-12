import normalizeModel from './../utilities/normalizeModel';
import { syncApptTypeAndTime } from './../utilities/appointmentTimes';
import riMoment from './../utilities/riMoment';

export function appointmentModel(state, args) {
  const model = normalizeModel(state.schema.definitions.appointment);
  model.date.value = riMoment(args.day);
  model.appointmentType.value = 'halfHour';
  model.startTime.value = args.startTime;
  console.log(`==========model.startTime==========`);
  console.log(model.startTime);
  console.log(`==========END model.startTime==========`);
  model.endTime.value = syncApptTypeAndTime(
    model.appointmentType.value,
    model.startTime.value,
  );
  model.trainerId.value = state.auth.user.trainerId;
  return model;
}

export function updateAppointmentModel(state, args, copy) {
  const appointment = state.appointments.filter(
    x => x.appointmentId === args.appointmentId,
  )[0];
  const model = normalizeModel(
    state.schema.definitions.appointment,
    appointment,
  );
  model.startTime.value = riMoment(model.startTime.value).format('hh:mm A');
  model.endTime.value = riMoment(model.endTime.value).format('hh:mm A');
  model.appointmentId.value = copy ? '' : model.appointmentId.value;
  // data in projection is an object, but when added to the store from
  // scheduleAppointment it is just an array of guids
  model.clients.value = model.clients.value.map(
    x => (typeof x === 'string' ? x : x.clientId),
  );

  return model;
}
