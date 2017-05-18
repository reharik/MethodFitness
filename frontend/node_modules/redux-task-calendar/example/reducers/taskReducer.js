export const RETRIEVE_TASKS_SUCCESS = 'calendar/tasks/RETRIEVE_TASKS_SUCCESS';

export default (state = [], action = null) => {
  switch (action.type) {
    case RETRIEVE_TASKS_SUCCESS:
    {
      return action.data.tasks;
    }
  }
  return state;
}
      