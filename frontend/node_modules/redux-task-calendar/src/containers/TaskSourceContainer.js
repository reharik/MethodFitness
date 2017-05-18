import Task from '../components/Task';
import { DragSource } from 'react-dnd';
import { TASK_DRAG_SOURCE } from './../modules/calendarModule';
import { momentFromTime } from './../utils/calendarUtils';
import moment from 'moment';

const taskSource = {
  beginDrag(props) {
    return {
      task: props.task
    };
  },
  endDrag(props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
    if (dropResult) {
      const task = { ...item.task,
        startTime: dropResult.time,
        endTime: momentFromTime(dropResult.time, props.displayTimeFormat)
          .add(item.task.slots * props.increment, 'minutes').format('h:mm A'),
        date: moment(dropResult.day).format(props.fetchDateFormat) };
      props.updateTaskViaDND(task);
    }
  },
  canDrag(props) {
    return props.task.editable;
  }
};

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
});

export default DragSource(TASK_DRAG_SOURCE, taskSource, collect)(Task); // eslint-disable-line new-cap
