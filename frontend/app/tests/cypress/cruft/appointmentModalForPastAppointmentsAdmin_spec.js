/* eslint-disable no-undef */
const _routines = require('./../helpers/routines');
const setupRoutes = require('./../helpers/setupRoutes');

describe.skip('Appointment Modal For Past Appointments Admin', () => {
  let routines;
  const aDT = require('./../fixtures/appointments')(
    Cypress.moment,
    undefined,
    true,
  );
  const client1 = {
    LNF: 'Barr, Sarah',
    LN: 'Barr',
  };
  const client2 = {
    LNF: 'Ahern, Jessica',
    LN: 'Ahern',
  };
  const client3 = {
    LNF: 'Avedissian, Amanda',
    LN: 'Avedissian',
  };

  beforeEach(() => {
    setupRoutes(cy);
    routines = _routines(cy, Cypress, Cypress.moment);

    routines.loginAdmin({});
    cy.visit('/');
    cy.deleteAllAppointments();
    cy.get('.redux__task__calendar__header__date__nav > :nth-child(1)').click();
    cy.deleteAllAppointments();
    cy.get('.redux__task__calendar__header__date__nav > :nth-child(2)').click();
    cy.wait(500);
    cy.get('.redux__task__calendar__header__date__nav > :nth-child(2)').click();
    cy.deleteAllAppointments();
    cy.visit('/');
    cy.fixture('prices').as('prices');
  });

  describe('When editing an existing appointment in the past', () => {
    it('Should allow you to persist all edits', function() {
      let appointmentValues;

      /* create appointment and then update all the values, making sure they all persist
        then check that the client inventory went down and that the trainer verification
        shows in arrears
       */
      cy.wait('@fetchAppointments');
      cy.createAppointment(aDT.date, aDT.time, client1, 'Full Hour');
      appointmentValues = {
        index: 1,
        date: aDT.date,
        time: aDT.time,
        currentClient: client1,
        newClient: client2,
        appointmentType: 'Full Hour',
        notes: 'By! Everybody!',
      };
      routines.changeAppointment(appointmentValues);

      cy.log('2=======verify changes persisted=======');
      cy.clickOnAppointment(appointmentValues.date, appointmentValues.time);
      cy.get('ul[data-id=clients] li').contains(
        appointmentValues.newClient.LNF,
      );
      cy.get('span[data-id=appointmentType]').contains(
        appointmentValues.appointmentType,
      );
      // cy.get('span[data-id=date]').contains(aDT.day.format('MM/DD/YYYY'));
      // cy.get('span[data-id=startTime]').contains(appointmentValues.time);
      cy.get('span[data-id=notes]').contains(appointmentValues.notes);
      cy.get(`.form__footer__button`)
        .contains('Cancel')
        .click();

      routines.checkClientInventory({
        index: 3,
        client: client2,
        fullHourCount: '-1',
      });

      routines.checkVerification({
        index: 4,
        inarrearsCount: 1,
        inarrearsItemValues: {
          client: client2,
          date: aDT.date,
          appointmentType: 'Full Hour',
        },
      });

      /*
      purchase two hour long sessions for client and check that client inventory
      shows that only one session is available because they were in arrears
      also check that the trainer can no verify appoitnment
       */

      routines.purchaseSessions({
        index: 5,
        client: client2,
        fullHourCount: '2',
      });

      routines.checkClientInventory({
        index: 6,
        client: client2,
        fullHourCount: '1',
      });

      routines.checkSessions({
        index: 7,
        client: client2,
        availableCount: 1,
        usedCount: 1,
        usedItemValues: {
          date: aDT.date,
          appointmentType: 'Full Hour',
        },
      });

      routines.checkVerification({
        index: 8,
        availableCount: 1,
        availableItemValues: {
          client: client2,
          date: aDT.date,
          appointmentType: 'Full Hour',
        },
      });

      /*
      changee the appointment type and check that the inventory shows 2 available hours
      and -1 one half hour.  Check that purchases shows the session available again
      check that verification is not possible
       */

      appointmentValues = {
        index: 9,
        date: aDT.date,
        time: aDT.time,
        appointmentType: 'Half Hour',
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 10,
        client: client2,
        fullHourCount: '2',
        halfHourCount: '-1',
      });

      routines.checkSessions({
        index: 11,
        client: client2,
        availableCount: 2,
      });

      routines.checkVerification({
        index: 12,
        inarrearsCount: 1,
        inarrearsItemValues: {
          client: client2,
          date: aDT.date,
          appointmentType: 'Half Hour',
        },
      });

      /*
      change the client and check that original client's inventory is returned to 0,
      check that the new client shows -1 for half hour. check that verification is
      still there, but in arrears and shows new client
       */

      appointmentValues = {
        index: 13,
        date: aDT.date,
        time: aDT.time,
        currentClient: client2,
        newClient: client3,
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 14,
        client: client2,
        halfHourCount: '0',
      });

      /*
      refund purchase to clean up for next test
       */

      routines.refundSessions({
        index: 15,
        client: client2,
      });

      routines.checkClientInventory({
        index: 16,
        client: client3,
        halfHourCount: '-1',
      });

      routines.checkVerification({
        index: 17,
        inarrearsCount: 1,
        inarrearsItemValues: {
          client: client3,
          date: aDT.date,
          appointmentType: 'Half Hour',
        },
      });
    });
  });

  describe.only('When editing date on an existing appointment in the past', () => {
    it('Should allow you to persist all edits', function() {
      let appointmentValues;
      /*
      create appointment, then change date.  Check that the client list still shows -1,
      check that the verification is still not possible but reflects new date
       */
      cy.createAppointment(aDT.date, aDT.time, client1, 'Full Hour');

      const newMoment = Cypress.moment(aDT.day).subtract(1, 'day');
      appointmentValues = {
        index: 1,
        date: aDT.date,
        time: aDT.time,
        newDate: newMoment,
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 2,
        client: client1,
        fullHourCount: '-1',
      });

      routines.checkVerification({
        index: 3,
        inarrearsCount: 1,
        inarrearsItemValues: {
          client: client1,
          date: newMoment,
          appointmentType: 'Full Hour',
        },
      });

      /*
      purchase two full hour sessions, then change the day again, check client inventory is correct,
      check that the one session is still used but reflects the correct date, check that verification is
      possible and reflets the proper date
       */

      routines.purchaseSessions({
        index: 4,
        client: client1,
        fullHourCount: '2',
      });

      const newMoment2 = Cypress.moment(aDT.day).subtract(2, 'day');
      appointmentValues = {
        index: 5,
        date: newMoment,
        time: aDT.time,
        newDate: newMoment2,
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 6,
        client: client1,
        fullHourCount: '1',
      });

      routines.checkSessions({
        index: 7,
        availableCount: 1,
        usedCount: 1,
        client: client1,
        usedItemValues: {
          date: newMoment2,
          appointmentType: 'Full Hour',
        },
      });

      routines.checkVerification({
        index: 8,
        inarrearsItemValues: {
          client: client1,
          date: newMoment2,
          appointmentType: 'Full Hour',
        },
      });

      /*
       change appointment type, purchase two half hours for different client, then change appoitment
       client and date. check new client inventory correct and that one of their sessions is used
       and has the correct date.
       */
      routines.purchaseSessions({
        index: 9,
        client: client2,
        halfHourCount: '2',
      });

      const newMoment3 = Cypress.moment(aDT.day).subtract(3, 'day');
      appointmentValues = {
        index: 10,
        date: newMoment2,
        time: aDT.time,
        newDate: newMoment3,
        appointmentType: 'Half Hour',
        currentClient: client1,
        newClient: client2,
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 11,
        client: client1,
        halfHourCount: '0',
      });

      routines.checkClientInventory({
        index: 12,
        client: client2,
        halfHourCount: '1',
      });

      routines.checkVerification({
        index: 13,
        availableCount: 1,
        date: newMoment3,
        inarrearsItemValues: {
          client: client2,
          date: newMoment3,
          appointmentType: 'Half Hour',
        },
      });

      cy.log('14=====delete appointment for clean up=======');
      cy.deleteAppointment(newMoment3, aDT.time);

      routines.refundSessions({
        index: 15,
        client: client2,
      });

      routines.refundSessions({
        index: 16,
        client: client1,
      });

      //
      // fund ahern for half hour and move to new day and change to ahern
      // move to future and check verification, inventory etc
      // move back to past and check verification inventory etc
    });
  });

  describe.skip('When editing an existing appointment in the past', () => {
    it('Should allow you to persist all edits', function() {
      cy.createAppointment(aDT.date, aDT.time, client1, 'Full Hour');
      cy.clickOnAppointment(aDT.date, aDT.time);
      cy.get(`.form__footer__button`)
        .contains('Edit')
        .click();

      cy.get('#clients').click();
      cy.get('.ant-select-dropdown-menu-item')
        .contains(client1)
        .click();
      cy.get('.ant-select-dropdown-menu-item')
        .contains(client2)
        .click();

      cy.get('#appointmentType').click({
        force: true,
      });
      cy.get('.ant-select-dropdown-menu-item')
        .contains('Full Hour')
        .click();

      cy.get('#notes').type('By! Everybody!');

      cy.get('form').submit();

      cy.clickOnAppointment(aDT.date, aDT.time);
      cy.get('ul[data-id=clients] li').contains(client2);
      cy.get('span[data-id=appointmentType]').contains('Full Hour');
      cy.get('span[data-id=date]').contains(aDT.day.format('MM/DD/YYYY'));
      cy.get('span[data-id=start  Time]').contains(aDT.time);
      cy.get('span[data-id=notes]').contains('By! Everybody!');
    });
  });
});
