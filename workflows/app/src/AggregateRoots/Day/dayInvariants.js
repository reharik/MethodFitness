module.exports = function(invariant, moment) {
  return state => {
    return {
      expectEndTimeAfterStart(cmd) {
        invariant(
          moment(cmd.endTime).isAfter(moment(cmd.startTime)),
          'Appointment End Time must be after Appointment Start Time',
        );
      },

      expectAppointmentDurationCorrect(cmd) {
        let diff = moment(cmd.endTime).diff(moment(cmd.startTime), 'minutes');
        switch (cmd.appointmentType) {
          case 'halfHour': {
            invariant(
              diff === 30,
              'Given the Appointment Type of Half Hour the start time must be 30 minutes after the end time',
            );
            break;
          }
          case 'fullHour': {
            invariant(
              diff === 60,
              'Given the Appointment Type of Full Hour the start time must be 60 minutes after the end time',
            );
            break;
          }
          case 'pair': {
            invariant(
              diff === 60,
              'Given the Appointment Type of Pair the start time must be 60 minutes after the end time',
            );
            break;
          }
        }
      },

      expectCorrectNumberOfClients(cmd) {
        switch (cmd.appointmentType) {
          case 'halfHour':
          case 'fullHour': {
            invariant(
              cmd.clients && cmd.clients.length === 1,
              `Given the Appointment Type of ${
                cmd.appointmentType
              } you must have 1 and only 1 client assigned`,
            );
            break;
          }
          case 'pair': {
            invariant(
              cmd.clients && cmd.clients.length >= 2,
              `Given the Appointment Type of Pair you must have 2 or more clients assigned`,
            );
            break;
          }
        }
      },

      expectTrainerNotConflicting(cmd) {
        let trainerConflict = state.appointments
          .filter(
            x =>
              (x.appointmentId &&
                x.appointmentId !== cmd.appointmentId &&
                moment(x.startTime).isBetween(
                  cmd.startTime,
                  cmd.endTime,
                  'minutes',
                  '[)',
                )) ||
              (x.appointmentId &&
                x.appointmentId !== cmd.appointmentId &&
                moment(x.endTime).isBetween(
                  cmd.startTime,
                  cmd.endTime,
                  'minutes',
                  '(]',
                )),
          )
          .filter(x => x.trainerId === cmd.trainerId);
        invariant(
          trainerConflict.length <= 0,
          `New Appointment conflicts with existing Appointment:
           Existing:
              ${JSON.stringify(trainerConflict[0], null, 4)}
           -----------
           New: 
              ${JSON.stringify(cmd, null, 4)}
           for state trainerId: ${cmd.trainerId}.`,
        );
      },

      expectClientsNotConflicting(cmd) {
        let clientConflicts = state.appointments
          .filter(
            x =>
              (x.appointmentId &&
                x.appointmentId !== cmd.appointmentId &&
                moment(x.startTime).isBetween(
                  cmd.startTime,
                  cmd.endTime,
                  'minutes',
                  '[)',
                )) ||
              (x.appointmentId &&
                x.appointmentId !== cmd.appointmentId &&
                moment(x.endTime).isBetween(
                  cmd.startTime,
                  cmd.endTime,
                  'minutes',
                  '(]',
                )),
          )
          .filter(x =>
            x.clients.includes(c =>
              cmd.clients.includes(c2 => c.clientId === c2.clientId),
            ),
          );
        invariant(
          clientConflicts.length <= 0,
          `New Appointment conflicts with existing Appointment:
           Existing:
              ${JSON.stringify(clientConflicts[0], null, 4)}
           -----------
           New: 
              ${JSON.stringify(cmd, null, 4)}
           for at least one client: ${cmd.clients}.`,
        );
      },
    };
  };
};
