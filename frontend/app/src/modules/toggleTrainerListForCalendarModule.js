export const TOGGLE_TRAINERS_LIST_FOR_CALENDAR =
  'methodFit/toggleTrainerList/TOGGLE_TRAINERS_LIST_FOR_CALENDAR';

export default (state = [], action = {}) => {
  switch (action.type) {
    case TOGGLE_TRAINERS_LIST_FOR_CALENDAR: {
      return action.selectedTrainers;
    }
    default: {
      return state;
    }
  }
};

export function toggleTrainerListForCalendar(data) {
  return {
    type: TOGGLE_TRAINERS_LIST_FOR_CALENDAR,
    selectedTrainers: data,
  };
}
