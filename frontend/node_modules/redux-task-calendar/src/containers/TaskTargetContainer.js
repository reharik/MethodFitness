import Tasks from './../components/Tasks';
import { DropTarget } from 'react-dnd';
import { TASK_DRAG_SOURCE } from './../modules/calendarModule';

const taskTarget = {
  drop({time, day}) {
    return {time, day};
  }
};

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
});

export default DropTarget(TASK_DRAG_SOURCE, taskTarget, collect)(Tasks); // eslint-disable-line new-cap
