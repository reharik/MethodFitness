import React, { PropTypes } from 'react';
import MonthTasks from './MonthTasks';

const MonthWeek = ({weekDays,
                    calendarName,
                    fetchDateFormat,
                    dayStartsAt,
                    openSpaceClickedAction,
                    taskClickedAction,
                    openSpaceClickedEvent,
                    taskClickedEvent,
                    displayTimeFormat}) => {
  const selectSlotAction = time => {
    if(openSpaceClickedEvent){
      openSpaceClickedEvent(time.format(fetchDateFormat), dayStartsAt.format(displayTimeFormat), calendarName);
    } else {
      openSpaceClickedAction(time.format(fetchDateFormat), dayStartsAt.format(displayTimeFormat), calendarName);
    }
  };

  return (
    <ol className="redux__task__calendar__month__week" >
      { weekDays.map((day, idx) =>
        <li key={idx}
          className={day.classes}
          onClick={e => e.target === e.currentTarget ? selectSlotAction(day) : ''}>
          <div className="redux__task__calendar__month__day__number">{day.date()}</div>
          <MonthTasks tasks={day.tasks}
                      taskClickedAction={taskClickedAction}
                      taskClickedEvent={taskClickedEvent}
                      calendarName={calendarName} />
        </li>)
      }
    </ol>
    );
};

MonthWeek.propTypes = {
  weekDays: PropTypes.array.isRequired,
  calendarName: PropTypes.string.isRequired,
  fetchDateFormat: PropTypes.string.isRequired,
  dayStartsAt: PropTypes.object.isRequired,
  openSpaceClickedAction: PropTypes.func.isRequired,
  taskClickedAction: PropTypes.func.isRequired
};

export default MonthWeek;
