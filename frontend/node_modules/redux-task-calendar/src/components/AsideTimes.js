import React, { PropTypes } from 'react';

const AsideTimes = ({times}) => (
  <ol className="redux__task__calendar__times__column">
    <li className="redux__task__calendar__times__column__spacer__item">
      <div >&nbsp;</div>
    </li>
    {times.map(timeObj => (<li className={timeObj.classes} key={timeObj.time}>
      <div >{timeObj.display}</div>
    </li>)
    )}
  </ol>);

AsideTimes.propTypes = {
  times: PropTypes.array.isRequired
};

export default AsideTimes;
