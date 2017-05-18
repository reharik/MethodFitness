import { connect } from 'react-redux';
import DayView from '../components/DayView';
import { augmentTimes } from '../utils/calendarUtils';

function mapStateToProps(state, ownProps) {
  const times = augmentTimes('redux__task__calendar__times__column__item ',
    undefined,
    state.reduxTaskCalendar[ownProps.calendarName].config);

  return {
    times,
    calendarName: ownProps.calendarName
  };
}

export default connect(mapStateToProps)(DayView);
