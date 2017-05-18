import { connect } from 'react-redux';
import MonthView from '../components/MonthView';
import Calendar from 'node-calendar';

function mapStateToProps(state, ownProps) {
  const calState = state.reduxTaskCalendar[ownProps.calendarName];
  var weeks = new Calendar
    .Calendar(Calendar.SUNDAY)
    .monthdatescalendar(calState.date.year(),
      calState.date.month() + 1);
  return {
    weeks,
    calendarName: ownProps.calendarName
  };
}

export default connect(mapStateToProps)(MonthView);
