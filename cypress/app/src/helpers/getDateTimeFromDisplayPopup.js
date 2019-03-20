module.exports = (cy, Cypress) => {
  const getMomentForAppointment = () => {
    return cy.wait(1).then(() => {
      cy.get('.display__container__value span[data-id="appointmentDate"]')
        .invoke('val')
        .as('date');
      cy.get('.display__container__value span[data-id="startTime"]')
        .invoke('val')
        .as('time');
      const isPast = Cypress.moment().isAfter(
        Cypress.moment(`${cy.get('@date')} ${cy.get('@time')}`),
      );
      return Cypress.Promise.resolve(isPast);
    });
  };
  const isAppointmentInPast = () => {
    // cy.log(`==========getMomentForAppointment()=========`);
    // cy.log(getMomentForAppointment()); // eslint-disable-line quotes
    // cy.log(`==========END getMomentForAppointment()=========`);
    return getMomentForAppointment().then(mom => {
      return Cypress.Promise.resolve(Cypress.moment().isAfter(mom));
    });
  };

  return {
    getMomentForAppointment,
    isAppointmentInPast,
  };
};
