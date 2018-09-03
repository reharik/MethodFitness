import auth from './authModule';
import schema from './schemaModule';
import menu from './menuModule';
import trainers from './trainerModule';
import clients from './clientModule';
import purchases from './purchaseModule';
import toggleTrainerListForCalendar from './toggleTrainerListForCalendarModule';
import sessionVerification from './sessionVerificationModule';
import trainerPayment from './trainerPaymentModule';
import trainerPaymentDetail from './trainerPaymentDetailModule';
import notifications from './notificationModule';
import trainerClientRates from './trainerClientRatesModule';
import locations from './locationModule';

export { loginUser, logoutUser } from './authModule';
export { menuItemClicked, navBreadCrumbClicked } from './menuModule';
export {
  scheduleAppointment,
  fetchAppointmentAction,
  fetchAppointmentsAction,
  updateTaskViaDND,
} from './appointmentModule';

export default {
  auth,
  menu,
  schema,
  trainers,
  clients,
  toggleTrainerListForCalendar,
  purchases,
  trainerPayment,
  sessionVerification,
  trainerPaymentDetail,
  notifications,
  trainerClientRates,
  locations,
};
