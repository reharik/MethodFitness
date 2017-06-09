import { connect } from 'react-redux';
import Calendar from '../components/Calendar';
import { fetchAppointmentsAction, updateTaskViaDND } from './../modules';
import { fetchClientsAction } from './../modules/clientModule';
import { fetchTrainersAction } from './../modules/trainerModule';

const mapStateToProps = function(state) {
  let config = {
    increment: 15,
    calendarName: 'schedule',
    dataSource: 'appointments',
    defaultView: 'week'
  };
  config.taskFilter = state.auth.user.role === 'admin'
    ? (x, calState) => {
      return calState.toggleTrainerListForCalendar.includes(x.trainerId);
    }
    : x => x.trainerId === state.auth.user.id;

  return {
    isAdmin: state.auth.user.role === 'admin',
    config
  };
};

export default connect(mapStateToProps, {
  fetchClientsAction,
  fetchTrainersAction,
  retrieveDataAction: fetchAppointmentsAction,
  updateTaskViaDND
})(Calendar);
