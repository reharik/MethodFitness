import React, { PropTypes } from 'react';
import DayContainer from '../containers/DayContainer';

const WeedkDays = ({week, calendarName}) => {
  return (
    <ol className="redux__task__calendar__week__days">
      {week.map(day =>
        <li className="redux__task__calendar__week__day" key={day}>
          <DayContainer date={day} calendarName={calendarName} />
        </li>
      )}
    </ol>);
};

WeedkDays.propTypes = {
  calendarName: PropTypes.string.isRequired,
  week: PropTypes.array.isRequired
};

export default WeedkDays;
