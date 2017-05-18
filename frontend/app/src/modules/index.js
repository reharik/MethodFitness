import auth from './authModule';
import schema from './schemaModule';
import menu from './menuModule';
import trainers from './trainerModule';
import clients from './clientModule';
import purchase from './purchaseModule';
import ajaxState from './ajaxStateModule';
import toggleTrainerListForCalendar from './toggleTrainerListForCalendarModule';

export { loginUser, logoutUser } from './authModule';
export { menuItemClicked, navBreadCrumbClicked } from './menuModule';
export {
  scheduleAppointment,
  fetchAppointmentAction,
  fetchAppointmentsAction,
  updateTaskViaDND
} from './appointmentModule';

export default {
  auth,
  menu,
  schema,
  trainers,
  clients,
  toggleTrainerListForCalendar,
  ajaxState,
  purchase
};
