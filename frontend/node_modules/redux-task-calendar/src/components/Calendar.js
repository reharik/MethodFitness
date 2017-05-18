import React, { PropTypes } from 'react';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import HeaderContainer from '../containers/HeaderContainer';
import MonthViewContainer from '../containers/MonthViewContainer';
import WeekViewContainer from '../containers/WeekViewContainer'
import DayViewContainer from '../containers/DayViewContainer'

const Calendar = ({calendarView, calendarName, width}) => {
  let view = (<MonthViewContainer calendarName={calendarName} />);
  switch (calendarView) {
    case 'week':
      view = <WeekViewContainer calendarName={calendarName} />;
      break;
    case 'day':
      view = <DayViewContainer calendarName={calendarName} />;
      break;
  }

  const style = width ? {width} : {};
  
  return (<div className="redux__task__calendar__calendar" style={style}>
    <HeaderContainer calendarName={calendarName} />
    <div className="redux__task__calendar__calendar__display__view">
      { view }
    </div>
  </div>);
};

Calendar.propTypes = {
  calendarName: PropTypes.string.isRequired,
  calendarView: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired
};

export default DragDropContext(HTML5Backend)(Calendar); // eslint-disable-line new-cap
