const _routines = require('../../../../helpers/routines');
const setupRoutes = require('../../../../helpers/setupRoutes');
const _aDT = require('../../../../fixtures/appointments');
const appTimes = require('../../../../helpers/appointmentTimes');

describe('Changing a clients rates', () => {
  let routines;

  beforeEach(() => {
    routines = _routines(cy, Cypress, Cypress.moment);
    routines.cleanDB();
    setupRoutes(cy);

    routines.loginAdmin({});
    cy.visit('/');
    cy.fixture('prices').as('prices');
    cy.fixture('clients').as('clients');
    cy.fixture('trainers').as('trainers');
  });

  describe('When changing client rate and creating an unfunded appointment', () => {
    it('should pass all steps', function() {
      aDT1 = _aDT(Cypress.moment, appTimes.time1, true);
      routines.changeClientRates({
        index: 1,
        client: this.clients.client1,
        fullHour: 50,
        fullHourTenPack: 50,
        halfHour: 50,
        halfHourTenPack: 50,
        pair: 50,
        pairTenPack: 50,
        halfHourPair: 50,
        halfHourPairTenPack: 50,
        fullHourGroup: 50,
        fullHourGroupTenPack: 50,
        halfHourGroup: 50,
        halfHourGroupTenPack: 50,
        fortyFiveMinute: 50,
        fortyFiveMinuteTenPack: 50,
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      let aDT1 = _aDT(Cypress.moment, appTimes.time15, true);
      routines.createAppointment({
        date: aDT1.date,
        time: '1:00 AM',
        clients: [this.clients.client1],
        appointmentType: 'Full Hour',
      });
      routines.createAppointment({
        date: aDT1.date,
        time: '2:00 AM',
        clients: [this.clients.client1],
        appointmentType: 'Half Hour',
      });
      routines.createAppointment({
        date: aDT1.date,
        time: '3:00 AM',
        clients: [this.clients.client1, this.clients.client2],
        appointmentType: 'Pair',
      });
      routines.createAppointment({
        date: aDT1.date,
        time: '4:00 AM',
        clients: [this.clients.client1, this.clients.client2],
        appointmentType: 'Half Hour Pair',
      });
      routines.createAppointment({
        date: aDT1.date,
        time: '5:00 AM',
        clients: [
          this.clients.client1,
          this.clients.client2,
          this.clients.client3,
        ],
        appointmentType: 'Full Hour Group',
      });
      routines.createAppointment({
        date: aDT1.date,
        time: '6:00 AM',
        clients: [
          this.clients.client1,
          this.clients.client2,
          this.clients.client3,
        ],
        appointmentType: 'Half Hour Group',
      });
      routines.createAppointment({
        date: aDT1.date,
        time: '7:00 AM',
        clients: [this.clients.client1],
        appointmentType: 'Forty Five Minute',
      });

      routines.checkClientInventory({
        index: 1,
        client: this.clients.client1,
        fullHourCount: -1,
        halfHourCount: -1,
        pairCount: -1,
        halfHourPairCount: -1,
        fullHourGroupCount: -1,
        halfHourGroupCount: -1,
        fortyFiveMinute: -1,
      });

      routines.checkVerification({
        index: 2,
        inArrearsCount: 13,
        inArrearsItemValues: [
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Full Hour',
          },
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Half Hour',
          },
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Pair',
          },
          {
            client: this.clients.client2,
            date: aDT1.date,
            appointmentType: 'Pair',
          },
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Half Hour Pair',
          },
          {
            client: this.clients.client2,
            date: aDT1.date,
            appointmentType: 'Half Hour Pair',
          },
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Full Hour Group',
          },
          {
            client: this.clients.client2,
            date: aDT1.date,
            appointmentType: 'Full Hour Group',
          },
          {
            client: this.clients.client3,
            date: aDT1.date,
            appointmentType: 'Full Hour Group',
          },

          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Half Hour Group',
          },
          {
            client: this.clients.client2,
            date: aDT1.date,
            appointmentType: 'Half Hour Group',
          },
          {
            client: this.clients.client3,
            date: aDT1.date,
            appointmentType: 'Half Hour Group',
          },
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Forty Five Minute',
          },
        ],
      });

      routines.purchaseSessions({
        index: 3,
        client: this.clients.client1,
        fullHourCount: 2,
        halfHourCount: 2,
        pairCount: 2,
        halfHourPairCount: 2,
        fullHourGroupCount: 2,
        halfHourGroupCount: 2,
        fortyFiveMinuteCount: 2,
      });

      routines.checkClientInventory({
        index: 4,
        client: this.clients.client1,
        fullHourCount: 1,
        halfHourCount: 1,
        pairCount: 1,
        halfHourPairCount: 1,
        fullHourGroupCount: 1,
        halfHourGroupCount: 1,
        fortyFiveMinute: 1,
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client1,
        availableCount: 7,
        usedCount: 7,
        usedItemValues: [
          {
            date: aDT1.date,
            appointmentType: 'Full Hour',
            cost: 50,
            costTenPack: 50,
          },
          {
            date: aDT1.date,
            appointmentType: 'Half Hour',
            cost: 50,
            costTenPack: 50,
          },
          {
            date: aDT1.date,
            appointmentType: 'Pair',
            cost: 50,
            costTenPack: 50,
          },
          {
            date: aDT1.date,
            appointmentType: 'Half Hour Pair',
            cost: 50,
            costTenPack: 50,
          },
          {
            date: aDT1.date,
            appointmentType: 'Full Hour Group',
            cost: 50,
            costTenPack: 50,
          },
          {
            date: aDT1.date,
            appointmentType: 'Half Hour Group',
            cost: 50,
            costTenPack: 50,
          },
          {
            date: aDT1.date,
            appointmentType: 'Forty Five Minute',
            cost: 50,
            costTenPack: 50,
          },
        ],
      });

      routines.checkVerification({
        index: 2,
        availableCount: 7,
        inArrearsCount: 6,
        availableItemValues: [
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Full Hour',
            trainersCut: 32.5,
          },
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Half Hour',
            trainersCut: 32.5,
          },
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Pair',
            trainersCut: 32.5,
          },
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Half Hour Pair',
            trainersCut: 32.5,
          },
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Full Hour Group',
            trainersCut: 32.5,
          },
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Half Hour Group',
            trainersCut: 32.5,
          },
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Forty Five Minute',
            trainersCut: 32.5,
          },
        ],
        inArrearsItemValues: [
          {
            client: this.clients.client2,
            date: aDT1.date,
            appointmentType: 'Pair',
          },
          {
            client: this.clients.client2,
            date: aDT1.date,
            appointmentType: 'Half Hour Pair',
          },
          {
            client: this.clients.client2,
            date: aDT1.date,
            appointmentType: 'Full Hour Group',
          },
          {
            client: this.clients.client3,
            date: aDT1.date,
            appointmentType: 'Full Hour Group',
          },
          {
            client: this.clients.client2,
            date: aDT1.date,
            appointmentType: 'Half Hour Group',
          },
          {
            client: this.clients.client3,
            date: aDT1.date,
            appointmentType: 'Half Hour Group',
          },
        ],
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.verifyAppointments({
        index: 13,
      });

      routines.checkPayTrainer({
        index: 8,
        trainer: this.trainers.trainer1,
        // will increase when I add groups
        payableCount: 7,
      });

      routines.payTrainer({
        index: 9,
        trainer: this.trainers.trainer1,
      });

      routines.checkTrainerPayment({
        index: 10,
        appointmentCount: 7,
        appointments: [
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Full Hour',
          },
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Half Hour',
          },
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Pair',
          },
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Half Hour Pair',
          },
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Full Hour Group',
          },
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Half Hour Group',
          },
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Forty Five Minute',
          },
        ],
      });
    });
  });

  describe('When creating an funded appointment in the past', () => {
    it('should pass all steps', function() {
      aDT1 = _aDT(Cypress.moment, appTimes.time14, true);
      routines.changeClientRates({
        index: 1,
        client: this.clients.client1,
        fullHour: 50,
        fullHourTenPack: 50,
        halfHour: 50,
        halfHourTenPack: 50,
        pair: 50,
        pairTenPack: 50,
        halfHourPair: 50,
        halfHourPairTenPack: 50,
        fullHourGroup: 50,
        fullHourGroupTenPack: 50,
        halfHourGroup: 50,
        halfHourGroupTenPack: 50,
        fortyFiveMinute: 50,
        fortyFiveMinuteTenPack: 50,
      });

      routines.purchaseSessions({
        index: 3,
        client: this.clients.client1,
        fullHourCount: 2,
        halfHourCount: 2,
        pairCount: 2,
        halfHourPairCount: 2,
        fullHourGroupCount: 2,
        halfHourGroupCount: 2,
        fortyFiveMinuteCount: 2,
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      let aDT1 = _aDT(Cypress.moment, appTimes.time15, true);
      routines.createAppointment({
        date: aDT1.date,
        time: '1:00 AM',
        clients: [this.clients.client1],
        appointmentType: 'Full Hour',
      });
      routines.createAppointment({
        date: aDT1.date,
        time: '2:00 AM',
        clients: [this.clients.client1],
        appointmentType: 'Half Hour',
      });
      routines.createAppointment({
        date: aDT1.date,
        time: '3:00 AM',
        clients: [this.clients.client1, this.clients.client2],
        appointmentType: 'Pair',
      });
      routines.createAppointment({
        date: aDT1.date,
        time: '4:00 AM',
        clients: [this.clients.client1, this.clients.client2],
        appointmentType: 'Half Hour Pair',
      });
      routines.createAppointment({
        date: aDT1.date,
        time: '5:00 AM',
        clients: [
          this.clients.client1,
          this.clients.client2,
          this.clients.client3,
        ],
        appointmentType: 'Full Hour Group',
      });
      routines.createAppointment({
        date: aDT1.date,
        time: '6:00 AM',
        clients: [
          this.clients.client1,
          this.clients.client2,
          this.clients.client3,
        ],
        appointmentType: 'Half Hour Group',
      });
      routines.createAppointment({
        date: aDT1.date,
        time: '7:00 AM',
        clients: [this.clients.client1],
        appointmentType: 'Forty Five Minute',
      });

      routines.checkClientInventory({
        index: 4,
        client: this.clients.client1,
        fullHourCount: 1,
        halfHourCount: 1,
        pairCount: 1,
        halfHourPairCount: 1,
        fullHourGroupCount: 1,
        halfHourGroupCount: 1,
        fortyFiveMinute: 1,
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client1,
        availableCount: 7,
        usedCount: 7,
        usedItemValues: [
          {
            date: aDT1.date,
            appointmentType: 'Full Hour',
          },
          {
            date: aDT1.date,
            appointmentType: 'Half Hour',
          },
          {
            date: aDT1.date,
            appointmentType: 'Pair',
          },
          {
            date: aDT1.date,
            appointmentType: 'Half Hour Pair',
          },
          {
            date: aDT1.date,
            appointmentType: 'Full Hour Group',
          },
          {
            date: aDT1.date,
            appointmentType: 'Half Hour Group',
          },
          {
            date: aDT1.date,
            appointmentType: 'Forty Five Minute',
          },
        ],
      });

      routines.checkVerification({
        index: 2,
        availableCount: 7,
        inArrearsCount: 6,
        availableItemValues: [
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Full Hour',
          },
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Half Hour',
          },
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Pair',
          },
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Half Hour Pair',
          },
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Full Hour Group',
          },
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Half Hour Group',
          },
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Forty Five Minute',
          },
        ],
        inArrearsItemValues: [
          {
            client: this.clients.client2,
            date: aDT1.date,
            appointmentType: 'Pair',
          },
          {
            client: this.clients.client2,
            date: aDT1.date,
            appointmentType: 'Half Hour Pair',
          },
          {
            client: this.clients.client2,
            date: aDT1.date,
            appointmentType: 'Full Hour Group',
          },
          {
            client: this.clients.client3,
            date: aDT1.date,
            appointmentType: 'Full Hour Group',
          },
          {
            client: this.clients.client2,
            date: aDT1.date,
            appointmentType: 'Half Hour Group',
          },
          {
            client: this.clients.client3,
            date: aDT1.date,
            appointmentType: 'Half Hour Group',
          },
        ],
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.verifyAppointments({
        index: 13,
      });

      routines.checkPayTrainer({
        index: 8,
        trainer: this.trainers.trainer1,
        payableCount: 7,
      });

      routines.payTrainer({
        index: 9,
        trainer: this.trainers.trainer1,
      });

      routines.checkTrainerPayment({
        index: 10,
        appointmentCount: 7,
        appointments: [
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Full Hour',
          },
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Half Hour',
          },
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Pair',
          },
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Half Hour Pair',
          },
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Full Hour Group',
          },
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Half Hour Group',
          },
          {
            client: this.clients.client1,
            date: aDT1.date,
            appointmentType: 'Forty Five Minute',
          },
        ],
      });
    });
  });

  describe('when changing default client rate and creating new client', () => {
    it('should pass all steps', function() {
      routines.changeDefaultClientRates({
        index: 1,
        fullHour: 50,
        fullHourTenPack: 50,
        halfHour: 50,
        halfHourTenPack: 50,
        pair: 50,
        pairTenPack: 50,
        halfHourPair: 50,
        halfHourPairTenPack: 50,
        fullHourGroup: 50,
        fullHourGroupTenPack: 50,
        halfHourGroup: 50,
        halfHourGroupTenPack: 50,
        fortyFiveMinute: 50,
        fortyFiveMinuteTenPack: 50,
      });

      // create new client
      let aDT = _aDT(Cypress.moment, appTimes.time15, true);
      const client = this.clients.newClient;
      cy.navTo('Clients');
      cy.get('.contentHeader__button__new').click();
      cy.wait('@getdefaultclientrates').wait(500);
      cy.get('#firstName').type(client.firstName);
      cy.get('#lastName').type(client.lastName);
      cy.get('#mobilePhone').type(client.mobilePhone);
      cy.get('#secondaryPhone').type(client.secondaryPhone);
      cy.get('#email').type(client.email);
      routines.selectDate({
        newDate: aDT.date,
        dateContainerName: 'birthDate-container',
      });

      cy.get('#street1').type(client.street1);
      cy.get('#street2').type(client.street2);
      cy.get('#city').type(client.city);
      cy.get('#state').click({
        force: true,
      });
      cy.get('.ant-select-dropdown-menu-item')
        .contains(client.state)
        .click();
      cy.get('#zipCode').type(client.zipCode);
      cy.get('#sourceNotes').type(client.sourceNotes);

      cy.get('#source').click({
        force: true,
      });
      cy.get('.ant-select-dropdown-menu-item')
        .contains(client.source)
        .click();

      routines.selectDate({
        newDate: aDT.date,
        dateContainerName: 'startDate-container',
      });

      cy.get(`.form__footer__button`)
        .contains('Submit')
        .click({
          force: true,
        })
        .wait(1000);

      routines.purchaseSessions({
        index: 3,
        client,
        fullHourCount: 2,
        halfHourCount: 2,
        pairCount: 2,
        halfHourPairCount: 2,
        fullHourGroupCount: 2,
        halfHourGroupCount: 2,
        fortyFiveMinuteCount: 2,
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      let aDT1 = _aDT(Cypress.moment, appTimes.time15, true);
      routines.createAppointment({
        date: aDT1.date,
        time: '1:00 AM',
        clients: [client],
        appointmentType: 'Full Hour',
      });
      routines.createAppointment({
        date: aDT1.date,
        time: '2:00 AM',
        clients: [client],
        appointmentType: 'Half Hour',
      });
      routines.createAppointment({
        date: aDT1.date,
        time: '3:00 AM',
        clients: [client, this.clients.client2],
        appointmentType: 'Pair',
      });
      routines.createAppointment({
        date: aDT1.date,
        time: '4:00 AM',
        clients: [client, this.clients.client2],
        appointmentType: 'Half Hour Pair',
      });
      routines.createAppointment({
        date: aDT1.date,
        time: '5:00 AM',
        clients: [client, this.clients.client2, this.clients.client3],
        appointmentType: 'Full Hour Group',
      });
      routines.createAppointment({
        date: aDT1.date,
        time: '6:00 AM',
        clients: [client, this.clients.client2, this.clients.client3],
        appointmentType: 'Half Hour Group',
      });
      routines.createAppointment({
        date: aDT1.date,
        time: '7:00 AM',
        clients: [client],
        appointmentType: 'Forty Five Minute',
      });

      routines.checkClientInventory({
        index: 4,
        client,
        fullHourCount: 1,
        halfHourCount: 1,
        pairCount: 1,
        halfHourPairCount: 1,
        fullHourGroupCount: 1,
        halfHourGroupCount: 1,
        fortyFiveMinute: 1,
      });

      routines.checkSessions({
        index: 5,
        client,
        availableCount: 7,
        usedCount: 7,
        usedItemValues: [
          {
            date: aDT1.date,
            appointmentType: 'Full Hour',
            cost: 50,
            costTenPack: 50,
          },
          {
            date: aDT1.date,
            appointmentType: 'Half Hour',
            cost: 50,
            costTenPack: 50,
          },
          {
            date: aDT1.date,
            appointmentType: 'Pair',
            cost: 50,
            costTenPack: 50,
          },
          {
            date: aDT1.date,
            appointmentType: 'Half Hour Pair',
            cost: 50,
            costTenPack: 50,
          },
          {
            date: aDT1.date,
            appointmentType: 'Full Hour Group',
            cost: 50,
            costTenPack: 50,
          },
          {
            date: aDT1.date,
            appointmentType: 'Half Hour Group',
            cost: 50,
            costTenPack: 50,
          },
          {
            date: aDT1.date,
            appointmentType: 'Forty Five Minute',
            cost: 50,
            costTenPack: 50,
          },
        ],
      });

      routines.checkVerification({
        index: 2,
        availableCount: 7,
        inArrearsCount: 6,
        availableItemValues: [
          {
            client,
            date: aDT1.date,
            appointmentType: 'Full Hour',
            trainersCut: 32.5,
          },
          {
            client,
            date: aDT1.date,
            appointmentType: 'Half Hour',
            trainersCut: 32.5,
          },
          {
            client,
            date: aDT1.date,
            appointmentType: 'Pair',
            trainersCut: 32.5,
          },
          {
            client,
            date: aDT1.date,
            appointmentType: 'Half Hour Pair',
            trainersCut: 32.5,
          },
          {
            client,
            date: aDT1.date,
            appointmentType: 'Full Hour Group',
            trainersCut: 32.5,
          },
          {
            client,
            date: aDT1.date,
            appointmentType: 'Half Hour Group',
            trainersCut: 32.5,
          },
          {
            client,
            date: aDT1.date,
            appointmentType: 'Forty Five Minute',
            trainersCut: 32.5,
          },
        ],
        inArrearsItemValues: [
          {
            client: this.clients.client2,
            date: aDT1.date,
            appointmentType: 'Pair',
          },
          {
            client: this.clients.client2,
            date: aDT1.date,
            appointmentType: 'Half Hour Pair',
          },
          {
            client: this.clients.client2,
            date: aDT1.date,
            appointmentType: 'Full Hour Group',
          },
          {
            client: this.clients.client3,
            date: aDT1.date,
            appointmentType: 'Full Hour Group',
          },
          {
            client: this.clients.client2,
            date: aDT1.date,
            appointmentType: 'Half Hour Group',
          },
          {
            client: this.clients.client3,
            date: aDT1.date,
            appointmentType: 'Half Hour Group',
          },
        ],
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.verifyAppointments({
        index: 13,
      });

      routines.checkPayTrainer({
        index: 8,
        trainer: this.trainers.trainer1,
        payableCount: 7,
      });

      routines.payTrainer({
        index: 9,
        trainer: this.trainers.trainer1,
      });

      routines.checkTrainerPayment({
        index: 10,
        appointmentCount: 7,
        appointments: [
          {
            client,
            date: aDT1.date,
            appointmentType: 'Full Hour',
          },
          {
            client,
            date: aDT1.date,
            appointmentType: 'Half Hour',
          },
          {
            client,
            date: aDT1.date,
            appointmentType: 'Pair',
          },
          {
            client,
            date: aDT1.date,
            appointmentType: 'Half Hour Pair',
          },
          {
            client,
            date: aDT1.date,
            appointmentType: 'Full Hour Group',
          },
          {
            client,
            date: aDT1.date,
            appointmentType: 'Half Hour Group',
          },
          {
            client,
            date: aDT1.date,
            appointmentType: 'Forty Five Minute',
          },
        ],
      });
    });
  });
});
