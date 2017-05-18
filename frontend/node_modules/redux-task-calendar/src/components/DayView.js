import React, { PropTypes } from 'react';
import AsideTimes from './AsideTimes';
import DayContainer from '../containers/DayContainer';

const DayView = ({times, calendarName})=> (
  <div className="redux__task__calendar__day">
    <AsideTimes times={times} />
    <DayContainer calendarName={calendarName} />
  </div>
);

DayView.propTypes = {
  times: PropTypes.array.isRequired,
  calendarName: PropTypes.string.isRequired
};

export default DayView;
