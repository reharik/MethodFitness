import { connect } from 'react-redux';
import Day from '../components/Day';
import moment from 'moment';
import {process} from '../utils/widthAndColumn';
import {augmentTimes, normalizeTasks} from '../utils/calendarUtils';
import {openSpaceClickedAction, taskClickedAction} from './../modules/calendarModule'

function mapStateToProps(state, ownProps) {
  const calState = state.reduxTaskCalendar[ownProps.calendarName];
  var day = ownProps.date || calState.date || moment();
  var filterToday = x => moment(x.date).format('YYYYMMDD') === day.format('YYYYMMDD');
  var thisView = calState.view === 'week' ? 'redux__task__calendar__week__' : 'redux__task__calendar__';
  var classes = thisView + 'day__items__slot ';
  var unprocessedTasks = state[calState.config.dataSource]
    .filter(filterToday)
    .filter(a => calState.config.taskFilter(a, state))
    .map(a => calState.config.taskMap(a, state));
  var tasks = process(normalizeTasks(unprocessedTasks, calState.config));
  return {
    view: calState.view,
    tasks,
    times: augmentTimes(classes, day, calState.config),
    dayName: day.format('dddd'),
    isToday: day.format('YYYYMMDD') === moment().format('YYYYMMDD'),
    displayTimeFormat: calState.config.displayTimeFormat,
    fetchDateFormat: calState.config.fetchDateFormat,
    increment: calState.config.increment,
    calendarName: ownProps.calendarName,
    updateTaskViaDND: calState.config.updateTaskViaDND,
    openSpaceClickedEvent: calState.config.openSpaceClickedEvent,
    taskClickedEvent: calState.config.taskClickedEvent
  };
}

export default connect(mapStateToProps, {openSpaceClickedAction, taskClickedAction})(Day);
