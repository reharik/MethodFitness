import reducerMerge from './../utilities/reducerMerge';
import { getISODateTime } from './../utilities/appointmentTimes';
import config from './../utilities/configValues';
import moment from 'moment';
import { requestStates } from '../sagas/requestSaga';
import selectn from 'selectn';

export const FETCH_APPOINTMENTS = requestStates('fetch_appointments', 'appointments');
export const SCHEDULE_APPOINTMENT = requestStates('schedule_appointment', 'appointments');
export const UPDATE_APPOINTMENT = requestStates('update_appointment', 'appointments');
export const DELETE_APPOINTMENT = requestStates('delete_appointment', 'appointments');

export default (state = [], action = {}) => {
  switch (action.type) {
    case UPDATE_APPOINTMENT.SUCCESS: {
      let response = selectn('response.payload', action);
      let newItem = selectn('action.upsertedItem', action);
      if (response.updateType === 'rescheduleAppointmentToNewDay') {
        const newState = state.filter(x => x.id !== response.oldAppointmentId);
        newItem.id = response.newAppointmentId;
        return reducerMerge(newState, newItem);
      } else {
        return reducerMerge(state, newItem);
      }
    }
    // fallback intentional for non new day updates
    case SCHEDULE_APPOINTMENT.SUCCESS: {
      let upsertedItem = selectn('action.upsertedItem', action);
      upsertedItem.id = selectn('response.payload.appointmentId', action);
      return reducerMerge(state, upsertedItem);
    }
    case FETCH_APPOINTMENTS.SUCCESS: {
      return reducerMerge(state, action.response.appointments);
    }
    case DELETE_APPOINTMENT.SUCCESS: {
      let response = selectn('response.payload', action);
      return state.filter(x => x.id !== response.appointmentId);
    }
    default:
      return state;
  }
};

export function scheduleAppointment(data) {
  moment.locale('en');
  const startTime = getISODateTime(data.date, data.startTime);
  const endTime = getISODateTime(data.date, data.endTime);
  const formattedData = {
    ...data,
    date: startTime,
    startTime,
    endTime,
    entityName: moment(data.date).format('YYYYMMDD')
  };
  return {
    type: SCHEDULE_APPOINTMENT.REQUEST,
    states: SCHEDULE_APPOINTMENT,
    url: config.apiBase + 'appointment/scheduleAppointment',
    upsertedItem: formattedData,
    params: {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedData)
    }
  };
}

export function updateAppointment(data) {
  moment.locale('en');
  const startTime = getISODateTime(data.date, data.startTime);
  const endTime = getISODateTime(data.date, data.endTime);
  const formattedData = {
    ...data,
    date: startTime,
    startTime,
    endTime,
    entityName: moment(data.date).format('YYYYMMDD')
  };
  return {
    type: UPDATE_APPOINTMENT.REQUEST,
    states: UPDATE_APPOINTMENT,
    url: config.apiBase + 'appointment/updateAppointment',
    upsertedItem: formattedData,
    params: {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedData)
    }
  };
}

export function updateTaskViaDND(data) {
  const submitData = { ...data.orig, date: data.date, startTime: data.startTime, endTime: data.endTime };
  return updateAppointment(submitData);
}

export function deleteAppointment(appointmentId, date) {
  moment.locale('en');
  let apiUrl = `${config.apiBase}appointment/cancelAppointment`;
  return {
    type: DELETE_APPOINTMENT.REQUEST,
    states: DELETE_APPOINTMENT,
    url: apiUrl,
    params: {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appointmentId, entityName: moment(date).format('YYYYMMDD') })
    }
  };
}

export function fetchAppointmentAction(appointmentId) {
  let apiUrl = `${config.apiBase}fetchAppointment/${appointmentId}`;
  return {
    type: FETCH_APPOINTMENTS.REQUEST,
    states: FETCH_APPOINTMENTS,
    url: apiUrl,
    params: {
      method: 'GET',
      credentials: 'include'
    }
  };
}

export function fetchAppointmentsAction(
  startDate = moment().startOf('month'),
  endDate = moment().endOf('month'),
  trainerId
) {
  moment.locale('en');
  const start = moment(startDate).format('YYYY-MM-DD');
  const end = moment(endDate).format('YYYY-MM-DD');
  let apiUrl = `${config.apiBase}fetchAppointments/${start}/${end}`;

  return {
    type: FETCH_APPOINTMENTS.REQUEST,
    states: FETCH_APPOINTMENTS,
    url: apiUrl,
    params: {
      method: 'GET',
      body: { trainerIds: trainerId },
      credentials: 'include'
    }
  };
}
