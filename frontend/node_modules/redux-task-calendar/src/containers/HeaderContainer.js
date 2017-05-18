import { connect } from 'react-redux';
import Header from '../components/Header';
import { formatHeaderDisplay } from '../utils/calendarUtils';
import {selectToday, viewChangedEvent, incrementDate, decrementDate} from '../modules/calendarModule';


function mapStateToProps(state, ownProps) {
  const calState = state.reduxTaskCalendar[ownProps.calendarName];

  const retrieveDataAction = (view) =>
    calState.config.retrieveDataAction(
      calState.date.startOf(view).toString(calState.config.fetchDateFormat),
      calState.date.endOf(view).toString(calState.config.fetchDateFormat)
    );
  return {
    calendarName: ownProps.calendarName,
    calendarView: calState.view,
    selectedDay: calState.date,
    caption: formatHeaderDisplay(calState.date, calState.view),
    retrieveDataAction};
}

export default connect(mapStateToProps, {selectToday, viewChangedEvent, incrementDate, decrementDate})(Header);
