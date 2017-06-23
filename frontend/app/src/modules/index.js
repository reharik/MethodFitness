import auth from './authModule';
import schema from './schemaModule';
import menu from './menuModule';
import trainers from './trainerModule';
import clients from './clientModule';
import purchase from './purchaseModule';
import purchaseDetails from './purchaseDetailsModule';
import toggleTrainerListForCalendar from './toggleTrainerListForCalendarModule';
import sessionVerification from './sessionVerificationModule';
import trainerPayment from './trainerPaymentModule';

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
  purchase,
  trainerPayment,
  sessionVerification,
  purchaseDetails
};
