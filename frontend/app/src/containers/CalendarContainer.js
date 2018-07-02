import { connect } from 'react-redux';
import Calendar from '../components/Calendar';
import { fetchAppointmentsAction, updateTaskViaDND } from './../modules';
import { fetchClientsAction } from './../modules/clientModule';
import { fetchTrainersAction } from './../modules/trainerModule';
import { curriedPermissionToSetAppointment } from './../utilities/appointmentTimes';

const mapStateToProps = state => {
  const isAdmin = state.auth.user.role === 'admin';

  let config = {
    increment: 15,
    firstDayOfWeek: 0,
    calendarName: 'schedule',
    dataSource: 'appointments',
    defaultView: 'week',
    dayStartsAt: '5:00 AM',
    dayEndsAt: '11:30 PM',
    utcTime: true,
    taskId: 'appointmentId',
    dayDisplayFormat: 'ddd MM/DD',
  };

  config.canUpdate = curriedPermissionToSetAppointment(isAdmin);

  config.taskFilter = isAdmin
    ? (x, calState) =>
        calState.toggleTrainerListForCalendar.includes(x.trainerId)
    : x => x.trainerId === state.auth.user.trainerId;

  return {
    isAdmin,
    config,
  };
};

export default connect(
  mapStateToProps,
  {
    fetchClientsAction,
    fetchTrainersAction,
    retrieveDataAction: fetchAppointmentsAction,
    updateTaskViaDND,
  },
)(Calendar);
