import moment from 'moment';

export const INCREMENT_DATE = 'calendar/dates/INCREMENT_DATE';
export const DECREMENT_DATE = 'calendar/dates/DECREMENT_DATE';
export const SELECT_TODAY = 'calendar/dates/SELECT_TODAY';
export const SET_CONFIG = 'calendar/config/SET_CONFIG';
export const VIEW_CHANGED_EVENT = 'calendar/view/VIEW_CHANGED_EVENT';
export const TASK_CLICKED = 'calendar/task/TASK_CLICKED';
export const OPEN_SPACE_CLICKED = 'calendar/task/OPEN_SPACE_CLICKED';
export const NO_OP = 'NO_OP';
export const TASK_DRAG_SOURCE = 'calendar/task/TASK_DRAG_SOURCE';

export default (state = {}, action = null) => {
  const calState = state[action.calendarName];
  switch (action.type) {
    case SELECT_TODAY: {
      return {...state,
        [action.calendarName]: {...calState, date: moment()}};
    }
    case INCREMENT_DATE: {
      //moment in moment returns a clone
      return {...state,
        [action.calendarName]: {...calState, date: moment(calState.date.add(1, action.viewType))}};
    }
    case DECREMENT_DATE: {
      return {...state,
        [action.calendarName]: {...calState, date: moment(calState.date.subtract(1, action.viewType))}};
    }
    case VIEW_CHANGED_EVENT: {
      return {...state,
        [action.calendarName]: {...calState, view:action.view}};
    }
    case SET_CONFIG: {
      return {...state, [action.config.calendarName]: {
        config: action.config,
        date: moment(),
        view:'month'
      }}
    }
  }
  return state;
}

export function incrementDate(viewType, calendarName) {
  return {
    type: INCREMENT_DATE,
    viewType,
    calendarName
  };
}

export function decrementDate(viewType, calendarName) {
  return {
    type: DECREMENT_DATE,
    viewType,
    calendarName
  };
}

export function selectToday(view, calendarName) {
  return {
    type: SELECT_TODAY,
    calendarName
  };
}

export function setConfig(config) {
  return {
    type: SET_CONFIG,
    config
  };
}

export function viewChangedEvent(view, calendarName) {
  return {
    type: VIEW_CHANGED_EVENT,
    view,
    calendarName
  };
}

export function openSpaceClickedAction(day, time, calendarName) {
  return {
    type: OPEN_SPACE_CLICKED,
    day,
    time,
    calendarName
  };
}

export function taskClickedAction(id, task, calendarName) {
  return {
    type: TASK_CLICKED,
    id,
    task,
    calendarName
  };
}
