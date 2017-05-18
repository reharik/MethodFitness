import React, { PropTypes } from 'react';

const MonthTasks = ({tasks, calendarName, taskClickedAction, taskClickedEvent}) => {
  const selectTaskAction = task => {
    if(taskClickedEvent){
      taskClickedEvent(task.id, task, calendarName);
    } else {
      taskClickedAction(task.id, task, calendarName);
    }
  };

  return (<div className="redux__task__calendar__month__task">
      { tasks.map((t, index)=> { return (<div className="redux__task__calendar__month__task__item" key={index}
        style={{backgroundColor: t.color}}
        onClick={() => selectTaskAction(t)}>
        <div className="redux__task__calendar__month__task__item__title" style={{ backgroundColor: t.titleColor}} >{t.title}</div>
      </div>);
      })}
  </div>);
};

MonthTasks.propTypes = {
  tasks: PropTypes.array.isRequired,
  calendarName: PropTypes.string.isRequired,
  taskClickedAction: PropTypes.func.isRequired
};

export default MonthTasks;
