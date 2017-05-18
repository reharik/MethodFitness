import React, { PropTypes } from 'react';
import AsideTimes from './AsideTimes';
import WeekDays from './WeekDays';

const WeekView = ({times, week, calendarName}) => (
    <div className="redux__task__calendar__week">
      <AsideTimes times={times} />
      <WeekDays week={week} calendarName={calendarName} />
    </div>
  );


WeekView.propTypes = {
  calendarName: PropTypes.string.isRequired,
  week: PropTypes.array.isRequired,
  times: PropTypes.array.isRequired
};

export default WeekView;
