import { TASK_CLICKED, OPEN_SPACE_CLICKED } from '../../src/index'
import { momentFromTime } from '../../src/utils/calendarUtils';

export default (state = {}, action = null) => {
  if (action.type === TASK_CLICKED) {
    return { id: action.id };
  } else if(action.type === OPEN_SPACE_CLICKED){
    return { startTime: momentFromTime(action.time, 'h:mm A'), date: action.date };
  }
  return state;
}
