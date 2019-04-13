import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Calendar from '../components/Calendar';
import { fetchAppointmentsAction, updateTaskViaDND } from './../modules';
import { fetchClientsAction } from './../modules/clientModule';
import { fetchTrainersAction } from './../modules/trainerModule';
import { fetchAllLocationsAction } from './../modules/locationModule';
import { curriedPermissionToSetAppointment } from './../utilities/appointmentTimes';
import React, { useState, useEffect } from 'react';
import riMoment from './../utilities/riMoment';

const CalendarContainer = ({
  config,
  fetchClients,
  fetchTrainers,
  fetchAllLocations,
  fetchAppointments,
  updateDNDTask,
  isAdmin,
  appointments,
}) => {
  const [currentAppointments, setCurrentAppointments] = useState(appointments);
  const [startDate, setStartDate] = useState(riMoment().startOf('month'));
  const [endDate, setEndDate] = useState(riMoment().endOf('month'));
  useEffect(
    () => {
      fetchClients();
      fetchTrainers();
      fetchAllLocations();
      setAppointmentsInState();
    },
    [appointments],
  );

  const retrieveData = (
    // if we have different default calendar views
    // this is where we need to change the initial get
    start = riMoment().startOf('isoweek'),
    end = riMoment().endOf('isoweek'),
  ) => {
    fetchAppointments(start, end);
    setStartDate(start);
    setEndDate(end);
    setAppointmentsInState(start, end);
  };

  const setAppointmentsInState = (start = startDate, end = endDate) => {
    const appts = (appointments || []).filter(a => {
      const aDate = riMoment(a.appointmentDate);
      return aDate >= start && aDate <= end;
    });
    setCurrentAppointments(appts);
  };

  return (
    <Calendar
      retrieveData={retrieveData}
      fetchAppointments={fetchAppointments}
      updateTaskViaDND={updateDNDTask}
      isAdmin={isAdmin}
      config={config}
      appointments={currentAppointments}
    />
  );
};

CalendarContainer.propTypes = {
  config: PropTypes.object,
  fetchClients: PropTypes.func,
  fetchTrainers: PropTypes.func,
  fetchAllLocations: PropTypes.func,
  fetchAppointments: PropTypes.func,
  updateDNDTask: PropTypes.func,
  isAdmin: PropTypes.bool,
  appointments: PropTypes.array,
};

const mapStateToProps = state => {
  const isAdmin = state.auth.user.role === 'admin';

  let config = {
    increment: 15,
    firstDayOfWeek: 1,
    calendarName: 'schedule',
    dataSource: 'appointments',
    defaultView: 'week',
    dayStartsAt: '5:00 AM',
    dayEndsAt: '11:30 PM',
    utcTime: true,
    taskId: 'appointmentId',
    dayDisplayFormat: 'ddd MM/DD',
    specificTZ: 'America/New_York',
  };

  config.canUpdate = curriedPermissionToSetAppointment(isAdmin);

  config.taskFilter = isAdmin
    ? x => state.toggleTrainerListForCalendar.includes(x.trainerId)
    : x => x.trainerId === state.auth.user.trainerId;

  return {
    isAdmin,
    config,
    appointments: state.appointments,
  };
};

export default connect(
  mapStateToProps,
  {
    fetchClients: fetchClientsAction,
    fetchTrainers: fetchTrainersAction,
    fetchAllLocations: fetchAllLocationsAction,
    fetchAppointments: fetchAppointmentsAction,
    updateDNDTask: updateTaskViaDND,
  },
)(CalendarContainer);
