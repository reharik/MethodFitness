module.exports = function(
  moment,
  appointmentWatcher,
  clientWatcher,
  trainerWatcher,
  R,
  invariant,
  metaLogger,
) {
  return {
    getInitialState: (extraState = {}, optOuts = {}) => {
      const defaultState = {
        id: '00000000-0000-0000-0000-000000000001',
      };
      if (!optOuts.clients) {
        defaultState.clients = [];
      }
      if (!optOuts.trainers) {
        defaultState.trainers = [];
      }
      if (!optOuts.appointments) {
        defaultState.appointments = [];
      }
      if (!optOuts.sessions) {
        defaultState.sessions = [];
      }

      return Object.assign({}, defaultState, extraState);
    },
    baseHandler: (state, persistence, handlerName) => {
      async function fundedAppointmentAttendedByClient(event) {
        if (!state.innerState.appointments || !state.innerState.sessions) {
          return undefined;
        }
        const appointment = state.innerState.appointments.find(
          x => x.appointmentId === event.appointmentId,
        );
        state.innerState.sessions = state.innerState.sessions.map(x => {
          if (x.sessionId === event.sessionId) {
            return Object.assign({}, x, {
              used: true,
              appointmentId: event.appointmentId,
              appointmentDate: appointment.appointmentDate,
              startTime: appointment.startTime,
            });
          }
          return x;
        });

        return await persistence.saveState(state);
      }

      async function sessionsPurchased(event) {
        if (!state.innerState.sessions) {
          return undefined;
        }
        let sessions = event.sessions.map(x => ({
          used: !!x.appointmentId,
          sessionId: x.sessionId,
          purchaseId: event.purchaseId,
          appointmentId: x.appointmentId,
          // trainerId: x.trainerId,
          appointmentType: x.appointmentType,
          purchasePrice: x.purchasePrice,
          clientId: x.clientId,
        }));
        state.innerState.sessions = state.innerState.sessions.concat(sessions);

        return await persistence.saveState(state);
      }

      async function sessionsRefunded(event) {
        if (!state.innerState.sessions) {
          return undefined;
        }
        event.refundSessions.forEach(x => {
          let session = state.innerState.sessions.find(
            y => y.sessionId === x.sessionId,
          );
          session.refunded = true;
        });

        return await persistence.saveState(state);
      }

      async function sessionReturnedFromPastAppointment(event) {
        if (!state.innerState.sessions) {
          return undefined;
        }
        let session = state.innerState.sessions.find(
          x =>
            x.appointmentId === event.appointmentId &&
            x.sessionId === event.sessionId,
        );
        if (session) {
          session.used = false;
          delete session.appointmentId;
          delete session.verified;
        }

        return await persistence.saveState(state);
      }

      async function trainersClientRateChanged(event) {
        if (!state.innerState.trainers) {
          return undefined;
        }

        state.innerState.trainers = state.innerState.trainers.map(t => {
          if (t.trainerId === event.trainerId) {
            t.TCRS.map(
              c =>
                c.clientId === event.clientId
                  ? Object.assign(c, { rate: event.rate })
                  : c,
            );
            return t;
          }
          return t;
        });

        return await persistence.saveState(state);
      }

      async function trainersClientRatesUpdated(event) {
        if (!state.innerState.trainers) {
          return undefined;
        }

        event.clientRates.forEach(cr =>
          trainersClientRateChanged({
            trainerId: event.trainerId,
            clientId: cr.clientId,
            rate: cr.rate,
          }),
        );

        return await persistence.saveState(state);
      }

      async function trainerClientRemoved(event) {
        if (!state.innerState.trainers) {
          return undefined;
        }

        state.innerState.trainers = state.innerState.trainers.map(x => {
          if (x.trainerId === event.trainerId) {
            x.TCRS.filter(c => c.clientId !== event.clientId);
            return x;
          }
          return x;
        });

        return await persistence.saveState(state);
      }

      async function trainersNewClientRateSet(event) {
        if (!state.innerState.trainers) {
          return undefined;
        }
        let trainer = state.innerState.trainers.find(
          x => x.trainerId === event.trainerId,
        );
        invariant(
          trainer,
          `Unable to find trainer with ID: ${event.trainerId}`,
        );
        trainer.TCRS.push({ clientId: event.clientId, rate: event.rate });

        return await persistence.saveState(state);
      }

      async function trainerPaid(event) {
        if (!state.innerState.sessions) {
          return undefined;
        }
        state.innerState.sessions = state.innerState.sessions.map(
          x =>
            event.paidAppointments.some(y => x.sessionId === y.sessionId)
              ? Object.assign(x, { trainerPaid: true })
              : x,
        );

        return await persistence.saveState(state);
      }

      async function trainerVerifiedAppointments(event) {
        if (!state.innerState.appointments) {
          return undefined;
        }
        state.innerState.appointments = state.innerState.appointments.map(
          x =>
            event.sessionIds.some(y => x.sessionId === y)
              ? Object.assign(x, { verified: true })
              : x,
        );

        return await persistence.saveState(state);
      }

      async function sessionTransferredFromRemovedAppointmentToUnfundedAppointment(
        event,
      ) {
        if (!state.innerState.sessions) {
          return undefined;
        }
        let session = state.innerState.sessions.find(
          x => x.sessionId === event.sessionId,
        );
        session.appointmentId = event.appointmentId;

        return await persistence.saveState(state);
      }

      const output = metaLogger(
        {
          handlerType: handlerName,
          handlerName,
          fundedAppointmentAttendedByClient,
          sessionsPurchased,
          sessionsRefunded,
          sessionReturnedFromPastAppointment,
          trainerClientRemoved,
          trainersClientRateChanged,
          trainersClientRatesUpdated,
          trainersNewClientRateSet,
          trainerPaid,
          trainerVerifiedAppointments,
          sessionTransferredFromRemovedAppointmentToUnfundedAppointment,
        },
        handlerName,
      );

      return Object.assign(
        state.innerState.appointments
          ? appointmentWatcher(state, persistence, output.handlerName)
          : {},
        state.innerState.clients
          ? clientWatcher(state, persistence, output.handlerName)
          : {},
        state.innerState.trainers
          ? trainerWatcher(state, persistence, output.handlerName)
          : {},
        output,
      );
    },
  };
};
