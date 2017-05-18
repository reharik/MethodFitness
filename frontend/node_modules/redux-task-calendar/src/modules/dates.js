// import moment from 'moment';
//
// export const INCREMENT_DATE = 'calendar/dates/INCREMENT_DATE';
// export const DECREMENT_DATE = 'calendar/dates/DECREMENT_DATE';
// export const SELECT_TODAY = 'calendar/dates/SELECT_TODAY';
// export const SET_CONFIG = 'redux-datatable/column/SET_CONFIG';
//
//
// export default (state = {}, action = null) => {
//   const calState = state[action.config.calendarName];  
//
//   if (action.type === SELECT_TODAY) {
//     return {...calState,
//       date: moment()};
//   } else if (action.type === INCREMENT_DATE) {
//     //moment in moment returns a clone
//     return {...calState,
//       date: moment(calState.date.add(1, action.viewType))};
//   } else if (action.type === DECREMENT_DATE) {
//     return {...calState,
//       date: moment(calState.subtract(1, action.viewType))};
//   } else if (action.type == SET_CONFIG) {
//     return {...state, [action.config.calendarName]: {config: action.config}}
//   }
//   return state;
// };
//
//
// export function incrementDate(viewType) {
//   return {
//     type: INCREMENT_DATE,
//     viewType
//   };
// }
//
// export function decrementDate(viewType) {
//   return {
//     type: DECREMENT_DATE,
//     viewType
//   };
// }
//
// export function selectToday() {
//   return {
//     type: SELECT_TODAY
//   };
// }
//
// export function setConfig(config) {
//   return {
//     type: SET_CONFIG,
//     config
//   };
// }