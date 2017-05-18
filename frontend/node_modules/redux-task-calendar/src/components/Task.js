import React, { PropTypes } from 'react';
import Color from 'color';


const Task = ({task,
              index, 
              calendarName, 
              isDragging, 
              connectDragSource, 
              taskClickedAction,
              taskClickedEvent}) => {
  
  const styleTaskItem = (t, index, opacity) => ({
    width: t.width + '%',
    height: 18 * t.slots + 'px',
    marginLeft: index > 0 || t.margin === 0 ? '0' : t.margin + 1 + '%',
    zIndex: t.column,
    border: '2px solid ' + Color(t.color).darken(0.3).hexString(), //eslint-disable-line new-cap
    opacity
  });

  const styleTaskItemTitle = t =>
    ({backgroundColor: Color(t.color).darken(0.2).hexString()}); //eslint-disable-line new-cap

  const selectTaskAction = t => {
    if(taskClickedEvent){
      taskClickedEvent(t.id, t, calendarName)
    } else {
      taskClickedAction(t.id, t, calendarName);
    }
  };
  
  const opacity = isDragging ? 0.4 : 1;

  return (connectDragSource(<div className="redux__task__calendar__task__item"
                                 style={styleTaskItem(task, index, opacity)}
                                 onClick={() => selectTaskAction(task)}>
    <div className="redux__task__calendar__task__item__title" style={styleTaskItemTitle(task)}>{task.title}</div>
    <div className="redux__task__calendar__task__item__display"
         style={{ backgroundColor: task.color}}> {task.display}</div>
  </div>));
};

Task.propTypes = {
  task: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  calendarName: PropTypes.string.isRequired,
  taskClickedAction: PropTypes.func.isRequired
};

export default Task;
