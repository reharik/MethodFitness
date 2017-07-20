// module.exports = function(invariant) {
//   return class SessionsPurchased {
//     constructor(state = {}) {
//       this.id = state.id || '00000000-0000-0000-0000-000000000001';
//       this.clients = state.clients || [];
//       this.trainers = state.trainers || [];
//       this.appointments = state.appointments || [];
//       this.sessions = state.sessions || [];
//       this.purchases = state.purchases || [];
//       this.currentPurchase;
//     }
//
//     addTrainer(trainer) {
//       this.trainers.push(trainer);
//     }
//
//     addClient(client) {
//       this.clients.push(client);
//     }
//
//     addAppointment(item) {
//       this.appointments.push(item);
//     }
//
//     appointmentUpdated(item) {
//       this.appointments = this.appointments.map(x =>
//         x.id === item.id
//           ? item
//           : x);
//     }
//
//     removeAppointment(item) {
//       this.appointments = this.appointments.filter(x => x.id !== item.id);
//     }
//
//     sessionsPurchased(item) {
//       this.purchases.push(this.createPurchase(item));
//       this.sessions = this.sessions.concat(this.createSessions(item));
//       this.currentPurchase = item.id;
//       this.currentClient = item.clientId;
//     }
//
//     processFundedAppointment(item) {
//       let session = this.sessions.find(x => x.sessionId === item.sessionId);
//       let appointment = this.appointments.find(x => x.appointmentId === item.appointmentId);
//       let trainer = this.trainers.find(x => x.trainerId === appointment.trainerId);
//
//       session.appointmentId = appointment.appointmentId;
//       session.appointmentDate = appointment.date;
//       session.startTime = appointment.startTime;
//       session.trainer = trainer.trainerName;
//       this.currentPurchase = session.purchaseId;
//       this.currentClient = session.clientId;
//     }
//
//     cleanUp(purchase) {
//       if (purchase.sessions.every(x => !!x.appointmentId)) {
//         purchase.sessions.forEach(x => {
//           this.appointments.filter(a => a.appointmentId !== x.appointmentId);
//           this.sessions.filter(s => s.sessionId !== x.sessionId);
//         });
//         this.purchases.filter(p => p.purchaseId !== purchase.purchaseId);
//       }
//     }
//
//     createPurchase(item) {
//       return {
//         purchaseTotal: item.purchaseTotal,
//         purchaseDate: item.purchaseDate,
//         purchaseId: item.id,
//         clientId: item.clientId
//       };
//     }
//
//     createSessions(item) {
//       return item.sessions.map(x => ({
//         sessionId: x.sessionId,
//         purchaseId: item.id,
//         appointmentId: x.appointmentId,
//         appointmentType: x.appointmentType,
//         purchasePrice: x.purchasePrice,
//         clientId: x.clientId
//       }));
//     }
//
//     buildPurchase(purchaseId) {
//       const purchase = this.purchases.find(x => x.purchaseId === purchaseId);
//       purchase.sessions = this.sessions.filter(x => x.purchaseId === purchaseId);
//       this.cleanUp(purchase);
//       return purchase;
//     }
//   };
// };
