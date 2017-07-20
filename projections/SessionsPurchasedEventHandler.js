// module.exports = function(rsRepository,
//                           moment,
//                           SessionsPurchased,
//                           AppointmentWatcher,
//                           logger) {
//
//   return class sessionsPurchasedEventHandler {
//     constructor() {
//       this.sp = {};
//       this.handlerType = this.handlerName = 'sessionsPurchased';
//     }
//
//     async initialize() {
//       logger.info('sessionsPurchased started up');
//       let state = await rsRepository
//         .getAggregateViewMeta('sessionsPurchased', '00000000-0000-0000-0000-000000000001');
//
//       if (!state.purchases) {
//         this.sp = new SessionsPurchased();
//
//         await rsRepository.insertAggregateMeta('sessionsPurchased', this.sp);
//       } else {
//         this.sp = new SessionsPurchased(state);
//       }
//     }
//
//     async saveView(purchaseId, clientId) {
//       console.log('==========purchaseId=========');
//       console.log(purchaseId);
//       console.log('==========END purchaseId=========');
//
//       let sessionsPurchased = {};
//       if (clientId) {
//         sessionsPurchased = await rsRepository.getById(clientId, 'sessionsPurchased');
//         if (!sessionsPurchased.id) {
//           sessionsPurchased = { id: clientId, purchases: [] };
//         }
//         const purchase = this.sp.buildPurchase(purchaseId);
//         sessionsPurchased.purchases.filter(x => x.purchaseId !== purchaseId);
//         sessionsPurchased.purchases.push(purchase);
//       }
//
//       return await rsRepository.saveAggregateView(
//         'sessionsPurchased',
//         this.sp,
//         sessionsPurchased);
//     }
//
//     async trainerHired(event) {
//       this.sp.addTrainer({ id: event.id, trainerName: `${event.contact.firstName} ${event.contact.lastName}` });
//
//       return await this.saveView();
//     }
//
//     async clientAdded(event) {
//       this.sp.addClient({
//         id: event.id,
//         firstName: event.contact.firstName,
//         lastName: event.contact.lastName
//       });
//
//       return await this.saveView();
//     }
//
//     async appointmentScheduled(event) {
//       this.sp.addAppointment({
//         id: event.id,
//         appointmentType: event.appointmentType,
//         date: event.date,
//         startTime: event.startTime,
//         trainerId: event.trainerId,
//         clients: event.clients
//       });
//
//       return await this.saveView();
//     }
//
//     async appointmentUpdated(event) {
//       this.sp.appointmentUpdated({
//         id: event.id,
//         appointmentType: event.appointmentType,
//         date: event.date,
//         startTime: event.startTime,
//         trainerId: event.trainerId,
//         clients: event.clients
//       });
//
//       return await this.saveView();
//     }
//
//     async appointmentCanceled(event) {
//       this.sp.removeAppointment(event.id);
//       return await this.saveView();
//     }
//
//     async sessionsPurchased(event) {
//       this.sp.sessionsPurchased(event);
//       return await this.saveView(this.sp.currentPurchase, this.sp.currentClient);
//     }
//
//     async appointmentAttendedByClient(event) {
//       this.sp.processFundedAppointment(event);
//       return await this.saveView(this.sp.currentPurchase, this.sp.currentClient);
//     }
//
//     async unfundedAppointmentFundedByClient(event) {
//       this.sp.processFundedAppointment(event);
//       return await this.saveView(this.sp.currentPurchase, this.sp.currentClient);
//     }
//   };
// };
