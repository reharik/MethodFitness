import getMenuItems from './menuItems';
import setupRoutes from './setupRoutes';

module.exports = (cy, Cypress) => {
  const apptDT = require('./getDateTimeFromDisplayPopup')(cy, Cypress);
  const apiHost = Cypress.env('API_BASE_URL');

  const _changeClients = options => {
    cy.log(`------changing client-------`);

    if (!!options.currentClient && !!options.newClient) {
      cy.log(`----changing client----`);
      cy.dataId('clients-container', 'div')
        .find('li.ant-select-selection__choice')
        .contains(options.currentClient.LNF)
        .closest('li')
        .find('span.ant-select-selection__choice__remove')
        .wait(250)
        .click()
        .wait(500);
      cy.get('#clients').click();
      cy.get('.ant-select-dropdown-menu-item')
        .contains(options.newClient.LNF)
        .wait(250)
        .click()
        .wait(250);
      cy.get('#clients input').blur();
    }
    if (!!options.removeClient) {
      cy.log(`----removing client----`);
      cy.dataId('clients-container', 'div')
        .find('li.ant-select-selection__choice')
        .contains(options.removeClient.LNF)
        .closest('li')
        .find('span.ant-select-selection__choice__remove')
        .wait(250)
        .click()
        .wait(250);
    }
    if (!!options.currentClient && !!options.client2) {
      cy.log(`----adding client for pair----`);
      cy.get('#clients').click();
      cy.get('.ant-select-dropdown-menu-item')
        .contains(options.client2.LNF)
        .wait(250)
        .click()
        .wait(250);
      cy.get('#clients input').blur();
    }
    if (!!options.newClient && !!options.newClient2) {
      cy.log(`----changing both clients----`);
      cy.dataId('clients-container', 'div')
        .get('li.ant-select-selection__choice')
        .each(item =>
          cy
            .wrap(item)
            .find('span.ant-select-selection__choice__remove')

            .wait(250)
            .click()
            .wait(250),
        );
      cy.get('#clients').click();
      cy.get('.ant-select-dropdown-menu-item')
        .contains(options.newClient.LNF)
        .wait(250)
        .click()
        .wait(250);
      cy.get('.ant-select-dropdown-menu-item')
        .contains(options.newClient2.LNF)
        .wait(250)
        .click()
        .wait(250);
    }
  };

  const getAppointmentId = options => {
    // prettier-ignore-start */
    cy.log(`======================================================`);
    cy.log(`${options.index || ''}======Get Appointment Id======`);
    cy.log(`======================================================`);
    /* prettier-ignore-end */
    cy.navTo('Calendar');
    navToAppropriateWeek(options.date);
    cy.get(
      `ol[data-id='${options.date.format('ddd MM/DD')}']
 li[data-id='${options.time}'] .redux__task__calendar__task__item`,
    )
      .its('length')
      .as('appointmentId');
    return cy.get('@appointmentId');
  };

  const changeAppointment = options => {
    //TODO refactor me please
    // prettier-ignore-start */
    cy.log(`======================================================`);
    cy.log(`${options.index || ''}======Changing Appointment======`);
    cy.log(`======================================================`);
    /* prettier-ignore-end */
    cy.navTo('Calendar');
    clickOnAppointment({
      date: options.date,
      time: options.time,
      internal: true,
    });
    cy.get(`.form__footer__button`)
      .contains('Edit')
      .click({
        force: true,
      });

    _changeClients(options);

    if (options.location) {
      cy.log(`----changing appointment location----`);
      cy.get('#locationId').click({
        force: true,
      });
      cy.get('.ant-select-dropdown-menu-item')
        .contains(options.location.name)
        .wait(500)
        .click();
    }

    if (!!options.appointmentType) {
      cy.log(`----changing appointment type----`);
      cy.get('input#appointmentType').click({
        force: true,
      });
      cy.get('.ant-select-dropdown-menu-item')
        .contains(options.appointmentType)
        .wait(500)
        .click();
    }
    if (!!options.notes) {
      cy.log(`----changing notes----`);
      cy.get('#notes').type(options.notes);
    }
    if (options.newTrainer) {
      cy.log(`----changing Trainer----`);
      cy.get('#trainerId').click({ force: true });
      cy.get('.ant-select-dropdown-menu-item')
        .contains(options.newTrainer.LNF)
        .wait(250)
        .click()
        .wait(250);
    }

    if (!!options.newDate) {
      cy.log(`----changing date----`);
      cy.dataId('date-container', 'div')
        .find('input')
        .click();
      checkDatePickerForCorrectMonth(options.newDate).then(() => {
        cy.get(
          `[title="${options.newDate.format(
            'MMMM D, YYYY',
          )}"] > .ant-calendar-date`,
        ).click();
        cy.get('form').submit();
        cy.wait('@updateAppointmentFromPast').wait(1000);
      });
    } else {
      cy.get('form').submit();
      cy.wait('@updateAppointmentFromPast').wait(1000);
    }
  };

  const checkClientInventory = options => {
    /* prettier-ignore-start */
    cy.log(`======================================================`);
    cy.log(
      `${options.index || ''}======Checking ${
        options.client.LNF
      } Inventory======`,
    );
    cy.log(`======================================================`);
    /* prettier-ignore-end */
    cy.navTo('Clients');
    cy.wait('@fetchAllClients');
    cy.get('.ant-table-row-level-0 span')
      .contains(options.client.LN)
      .closest('tr')
      .find(':nth-child(1) > .list__cell__link > span')
      .click();
    cy.wait('@getClient');
    if (options.fullHourCount) {
      cy.dataId('clientInventory', 'div')
        .find(`span[data-id='fullHour']`)
        .contains(options.fullHourCount);
    }
    if (options.halfHourCount) {
      cy.dataId('clientInventory', 'div')
        .find(`span[data-id='halfHour']`)
        .contains(options.halfHourCount);
    }
    if (options.pairCount) {
      cy.dataId('clientInventory', 'div')
        .find(`span[data-id='pair']`)
        .contains(options.pairCount);
    }
  };

  const checkDatePickerForCorrectMonth = targetDate => {
    const targetMonth = targetDate.format('MMM');
    const nextMonth = Cypress.moment(targetDate)
      .add(1, 'month')
      .format('MMM');
    const lastMonth = Cypress.moment(targetDate)
      .subtract(1, 'month')
      .format('MMM');
    cy.get('.ant-calendar-month-select', {
      log: false,
    })
      .invoke('text')
      .as('currMonth');
    // cy.log(@currentMonth);
    cy.log(targetMonth);
    return cy.get('@currMonth', { log: false }).then(sow => {
      if (sow !== targetMonth && sow === nextMonth) {
        cy.get('.ant-calendar-prev-month-btn').click();
      } else if (sow !== targetMonth && sow === lastMonth) {
        cy.get('.ant-calendar-next-month-btn').click();
      }
    });
  };

  const checkPayTrainer = options => {
    /* prettier-ignore-start */
    cy.log(`======================================================`);
    cy.log(
      `${options.index || ''}======Checking Available To Pay Trainer======`,
    );
    cy.log(`======================================================`);
    /* prettier-ignore-end */
    cy.navTo('Trainers');
    cy.get('.ant-table-row-level-0 td')
      .contains(options.trainer.FN)
      .closest('tr')
      .find('td:last a.list__cell__link')
      .click();
    if (options.payableCount > 0) {
      cy.get('.ant-table-row').should('have.length', options.payableCount);
    } else {
      cy.get('.ant-table-row').should('not.exist');
    }
  };

  const checkSessions = options => {
    /* prettier-ignore-start */
    cy.log(`======================================================`);
    cy.log(
      `${options.index || ''}======Checking Sessions for ${
        options.client.LNF
      } ======`,
    );
    cy.log(`======================================================`);
    /* prettier-ignore-end */

    goToPurchasesList({ client: options.client });
    cy.get('tr.ant-table-row-level-0:last')
      .find('.ant-table-row-expand-icon')
      .click();
    if (options.usedCount) {
      cy.get('tr.row-gray').should('have.length', options.usedCount);
    }
    if (options.usedItemsValues) {
      cy.get('.ant-table-row > :nth-child(3)')
        .contains(options.usedItemsValues.appointmentType)
        .should('exist');
      cy.get('.ant-table-row > :nth-child(4)')
        .contains(options.usedItemsValues.date.format('MM/DD/YYYY'))
        .should('exist');
      if (options.usedItemsValues.startTime) {
        cy.get('.ant-table-row > :nth-child(5)')
          .contains(options.usedItemsValues.startTime)
          .should('exist');
      }
    }
    if (options.availableCount) {
      // find class for available
      cy.get('tr.ant-table-expanded-row .ant-table-row')
        .not('.row-gray')
        .should('have.length', options.availableCount);
    }
  };

  const checkTrainerPayment = options => {
    /* prettier-ignore-start */
    cy.log(`======================================================`);
    cy.log(`${options.index || ''}======Checking Trainer Payment======`);
    cy.log(`======================================================`);
    /* prettier-ignore-end */
    cy.navTo('Payment History');
    cy.wait('@trainerpayments').wait(500);
    cy.get('.ant-table-row:last')
      .find('span')
      .contains(Cypress.moment().format('MM/DD/YYYY'))
      .click();
    cy.wait('@trainerpaymentdetails');
    cy.get('.ant-table-row').should('have.length', options.appointmentCount);
    cy.get('.ant-table-row > :nth-child(1)').contains(
      options.appointmentValues.client.LNF,
    );
    cy.get('.ant-table-row > :nth-child(4)')
      .contains(options.appointmentValues.appointmentType)
      .should('exist');
    cy.get('.ant-table-row > :nth-child(2)')
      .contains(options.appointmentValues.date.format('MM/DD/YYYY'))
      .should('exist');
    if (options.appointmentValues.startTime) {
      cy.get('.ant-table-row > :nth-child(3)').contains(
        options.appointmentValues.startTime,
      );
    }
    if (options.appointmentValues2) {
      cy.get('.ant-table-row > :nth-child(1)').contains(
        options.appointmentValues2.client.LNF,
      );
      cy.get('.ant-table-row > :nth-child(4)')
        .contains(options.appointmentValues2.appointmentType)
        .should('exist');
      cy.get('.ant-table-row > :nth-child(2)')
        .contains(options.appointmentValues2.date.format('MM/DD/YYYY'))
        .should('exist');
      if (options.appointmentValues2.startTime) {
        cy.get('.ant-table-row > :nth-child(3)').contains(
          options.appointmentValues2.startTime,
        );
      }
    }
  };

  const checkVerification = options => {
    /* prettier-ignore-start */
    cy.log(`======================================================`);
    cy.log(`${options.index || ''}======Checking Verification======`);
    cy.log(`======================================================`);
    /* prettier-ignore-end */
    cy.wait(2000);
    cy.navTo('Trainer Verification');
    cy.wait('@fetchUnverifiedAppointments');
    if (options.inarrearsCount) {
      cy.get('tr.row-in-arrears').should('have.length', options.inarrearsCount);
    }
    if (options.availableCount) {
      // find proper class for available
      cy.get('tr.ant-table-row')
        .not('.row-in-arrears')
        .should('have.length', options.availableCount);
    }
    if (options.availableItemValues) {
      cy.get('.ant-table-row')
        .not('.row-in-arrears')
        .get(':nth-child(2)')
        .contains(options.availableItemValues.client.LNF);
      cy.get('.ant-table-row')
        .not('.row-in-arrears')
        .get(':nth-child(5)')
        .contains(options.availableItemValues.appointmentType);
      cy.get('.ant-table-row')
        .not('.row-in-arrears')
        .get(':nth-child(3)')
        .contains(options.availableItemValues.date.format('MM/DD/YYYY'));
      if (options.availableItemValues.startTime) {
        cy.get('.ant-table-row')
          .not('.row-in-arrears')
          .get(':nth-child(4)')
          .contains(options.availableItemValues.startTime);
      }
    }
    if (options.availableItemValues2) {
      cy.get('.ant-table-row')
        .not('.row-in-arrears')
        .get(':nth-child(2)')
        .contains(options.availableItemValues2.client.LNF);
      cy.get('.ant-table-row')
        .not('.row-in-arrears')
        .get(':nth-child(5)')
        .contains(options.availableItemValues2.appointmentType);
      cy.get('.ant-table-row')
        .not('.row-in-arrears')
        .get(':nth-child(3)')
        .contains(options.availableItemValues2.date.format('MM/DD/YYYY'));
      if (options.availableItemValues2.startTime) {
        cy.get('.ant-table-row')
          .not('.row-in-arrears')
          .get(':nth-child(4)')
          .contains(options.availableItemValues2.startTime);
      }
    }
    if (options.inarrearsItemValues) {
      cy.get('.row-in-arrears > :nth-child(2)')
        .contains(options.inarrearsItemValues.client.LNF)
        .should('exist');
      cy.get('.row-in-arrears > :nth-child(5)')
        .contains(options.inarrearsItemValues.appointmentType)
        .should('exist');
      cy.get('.row-in-arrears > :nth-child(3)')
        .contains(options.inarrearsItemValues.date.format('MM/DD/YYYY'))
        .should('exist');
      if (options.inarrearsItemValues.startTime) {
        cy.get('.row-in-arrears > :nth-child(4)').contains(
          options.inarrearsItemValues.startTime,
        );
      }
    }
    if (options.inarrearsItemValues2) {
      cy.get('.row-in-arrears > :nth-child(2)')
        .contains(options.inarrearsItemValues2.client.LNF)
        .should('exist');
      cy.get('.row-in-arrears > :nth-child(5)')
        .contains(options.inarrearsItemValues2.appointmentType)
        .should('exist');
      cy.get('.row-in-arrears > :nth-child(3)')
        .contains(options.inarrearsItemValues2.date.format('MM/DD/YYYY'))
        .should('exist');
      if (options.inarrearsItemValues2.startTime) {
        cy.get('.row-in-arrears > :nth-child(4)').contains(
          options.inarrearsItemValues2.startTime,
        );
      }
    }
    if (options.noInarrears) {
      // const rows = Cypress.$(`.ant-table-row`);
      // if (rows.length > 0) {
      cy.get('.ant-table-row.row-in-arrears').should('not.exist');
      // }
    }
    if (options.noAvailable) {
      Cypress.$(`.ant-table-row`).each(row => {
        cy.wrap(row)
          .find('.row-in-arrears')
          .should('not.exist');
      });
    }
  };

  const clickOnAppointment = options => {
    if (!options.internal) {
      /* prettier-ignore-start */
      cy.log(`======================================================`);
      cy.log(
        `${options.index ||
          ''}======Click On Appointment: ${options.date.toString()}======`,
      );
      cy.log(`======================================================`);
      /* prettier-ignore-end */
    }
    navToAppropriateWeek(options.date);
    const appointment = cy.get(`ol[data-id='${options.date.format(
      'ddd MM/DD',
    )}']
 li[data-id='${options.time}'] .redux__task__calendar__task__item`);
    appointment.click();
  };

  const createAppointment = options => {
    /* prettier-ignore-start */
    cy.log(`======================================================`);
    cy.log(
      `${options.index ||
        ''}======Creating an Appointment: ${options.date.toString()}======`,
    );
    cy.log(`======================================================`);
    /* prettier-ignore-end */

    navToAppropriateWeek(options.date);
    cy.get(
      `ol[data-id='${options.date.format('ddd MM/DD')}'] li[data-id='${
        options.time
      }']`,
    ).click();

    cy.get('#clients').click();
    cy.get('.ant-select-dropdown-menu-item')
      .contains(options.client.LNF)
      .click();

    if (options.client2) {
      cy.get('.ant-select-dropdown-menu-item')
        .contains(options.client2.LNF)
        .click();
    } else if (options.appointmentType) {
      cy.get('input#appointmentType')
        .focus({ log: false })
        .click({ force: true });
      cy.get('.ant-select-dropdown-menu-item')
        .contains(options.appointmentType)
        .click({ log: false });
    }
    if (options.trainer) {
      cy.get('#trainerId').click({ force: true });
      cy.get('.ant-select-dropdown-menu-item')
        .contains(options.trainer.LNF)
        .click({ log: false });
    }
    if (options.location) {
      cy.get('input#locationId')
        .focus({ log: false })
        .click({ force: true });
      cy.get('.ant-select-dropdown-menu-item')
        .contains(options.location.name)
        .click({ log: false });
    }
    cy.get('#notes').type('Hi! Everybody!');
    cy.get('form').submit();
    cy.wait(
      options.future ? '@scheduleAppointment' : '@scheduleAppointmentInPast',
    );
    cy.get('#mainCalendar').should('exist');
    cy.get(
      `ol[data-id='${options.date.format('ddd MM/DD')}']
 li[data-id='${options.time}'] div.redux__task__calendar__task__item`,
    ).should('exist');
  };

  const cleanDB = () => {
    /* prettier-ignore-start */
    console.log(`=========="killing data"==========`);
    console.log('killing data');
    console.log(`==========END "killing data"==========`);

    cy.log(`======================================================`);
    cy.log(`======Clean all tables in db======`);
    cy.log(`======================================================`);
    /* prettier-ignore-end */
    cy.exec('make dockerDownTestsData', { failOnNonZeroExit: false });
    // cy.wait(10000);
    cy.exec('make dockerUpTestsData', { failOnNonZeroExit: false });
    // cy.exec('make dockerDownTestsData', { failOnNonZeroExit: false });
    // cy.exec('make dockerUpTestsData', { failOnNonZeroExit: false });
    cy.wait(6000);
    cy.request('GET', `${apiHost}/healthcheck/systemsup`)
      .its('status')
      .should('equal', 200);

    // cy.request('POST', `${apiHost}/appointment/cleanalltestdata`);
    // cy.wait(2000);
    // cy.wait('@cleanalltestdata');
  };

  const deleteAllAppointments = () => {
    /* prettier-ignore-start */
    cy.log(`======================================================`);
    cy.log(`======Delete All Appointments======`);
    cy.log(`======================================================`);
    /* prettier-ignore-end */

    cy.request('POST', `${apiHost}/appointment/cleanalltestdata`);
    cy.wait(2000);
  };

  const deleteAppointment = options => {
    /* prettier-ignore-start */
    cy.log(`======================================================`);
    cy.log(
      `${options.index ||
        ''}======Delete Appointment: ${options.date.toString()}======`,
    );
    cy.log(`======================================================`);
    /* prettier-ignore-end */

    cy.navTo('Calendar');
    clickOnAppointment({
      date: options.date,
      time: options.time,
      internal: true,
    });
    let isPast = apptDT.getMomentForAppointment();
    cy.get(`.form__footer__button`)
      .contains('Delete')
      .click({
        force: true,
      });
    isPast.then(
      x =>
        x ? cy.wait('@deletePastAppointment') : cy.wait('@cancelappointment'),
    );
  };

  const loginAdmin = options => {
    /* prettier-ignore-start */
    cy.log(`======================================================`);
    cy.log(`${options.index || ''}======Admin Logging In======`);
    cy.log(`======================================================`);
    /* prettier-ignore-end */

    const menuData = {
      menuItems: getMenuItems('admin'),
      path: [],
      breadCrumbItems: ['Home'],
      currentItem: '',
    };
    localStorage.setItem('menu_data', JSON.stringify(menuData));
    cy.fixture('trainers').then(trainers => {
      cy.request('POST', `${apiHost}/auth`, {
        userName: trainers.trainer1.userName,
        password: trainers.trainer1.password,
      });
    });
  };

  const manuallyLoginTrainer = options => {
    /* prettier-ignore-start */
    cy.log(`======================================================`);
    cy.log(
      `${options.index || ''}======Trainer Manually Logging In: ${
        options.trainer.LNF
      }======`,
    );
    cy.log(`======================================================`);
    /* prettier-ignore-end */
    cy.get('#userName').type(options.trainer.userName);
    cy.get('#password').type(options.trainer.password);
    cy.get('form').submit();
    cy.wait('@auth');
  };

  const loginTrainer = options => {
    /* prettier-ignore-start */
    cy.log(`======================================================`);
    cy.log(
      `${options.index || ''}======Trainer Logging In: ${
        options.trainer.LNF
      }======`,
    );
    cy.log(`======================================================`);
    /* prettier-ignore-end */
    const menuData = {
      menuItems: getMenuItems('trainer'),
      path: [],
      breadCrumbItems: ['Home'],
      currentItem: '',
    };
    localStorage.setItem('menu_data', JSON.stringify(menuData));
    const { userName, password } = options.trainer;
    // programmatically log us in without needing the UI
    cy.request('POST', `${apiHost}/auth`, {
      userName,
      password,
    });
  };

  const navToAppropriateWeek = date => {
    cy.get('.redux__task__calendar__week input[data-id="startOfWeek"]', {
      log: false,
    })
      .invoke('val')
      .as('sowValue');
    cy.get('@sowValue', { log: false }).then(sow => {
      const startOfWeek = Cypress.moment(sow).startOf('day');
      cy.log(startOfWeek.toString());
      cy.log(date.toString());
      if (date.isBefore(startOfWeek)) {
        cy.log(`======navigate one week back======`);
        cy.get('.redux__task__calendar__header__date__nav > :nth-child(1)', {
          log: false,
        }).click({ log: false });
        cy.wait('@fetchAppointments', {
          log: false,
        }).wait(250);
      }
    });

    cy.get('.redux__task__calendar__week input[data-id="endOfWeek"]', {
      log: false,
    })
      .invoke('val')
      .as('eowValue');
    cy.get('@eowValue', { log: false }).then(eow => {
      const endOfWeek = Cypress.moment(eow)
        .subtract(1, 'day')
        .endOf('day');
      if (date.isAfter(endOfWeek)) {
        cy.log(`======navigate one week forward======`);
        cy.get('.redux__task__calendar__header__date__nav > :nth-child(2)', {
          log: false,
        }).click({ log: false });
        cy.wait('@fetchAppointments', {
          log: false,
        });
      }
    });
  };

  const payTrainer = options => {
    /* prettier-ignore-start */
    cy.log(`======================================================`);
    cy.log(`${options.index || ''}======Paying Trainer======`);
    cy.log(`======================================================`);
    /* prettier-ignore-end */
    cy.navTo('Trainers');
    cy.get('.ant-table-row-level-0 td')
      .contains(options.trainer.FN)
      .closest('tr')
      .find('td:last a.list__cell__link')
      .click();

    cy.get('div.ant-table-selection input').click();
    cy.get('button.contentHeader__button')
      .contains('Submit Trainer Payment')
      .click();

    cy.log('-----CONFIRMATION_BOX-----');
    cy.get('button')
      .contains('OK')
      .click({ force: true });
    cy.wait('@paytrainer');
    cy.get('tr.row-in-arrears').should('have.length', 0);
  };

  const gotToPurchaseList = options => {
    cy.get('span.menu__item__leaf__link')
      .contains('Clients')
      .click();
    cy.wait('@fetchAllClients');
    const row = cy
      .get('.ant-table-row-level-0')
      .find('span')
      .contains(options.client.LN)
      .closest('tr');
    row.find('td:last a.list__cell__link span').click();
    cy.wait('@fetchpurchases').wait(500);
  };

  const purchaseSessions = options => {
    /* prettier-ignore-start */
    cy.log(`======================================================`);
    cy.log(
      `${options.index || ''}======Purchasing Sessions for ${
        options.client.LNF
      } ======`,
    );
    cy.log(`======================================================`);
    /* prettier-ignore-end */

    goToPurchasesList({ client: options.client });
    cy.get('.contentHeader__button__new').click();

    if (options.fullHourCount) {
      cy.dataId('fullHour-container', 'div')
        .find('input')
        .type(options.fullHourCount);
    }
    if (options.fullHourTenPackCount) {
      cy.dataId('fullHour-container', 'div')
        .find('input')
        .type(options.fullHourTenPackCount);
    }
    if (options.halfHourCount) {
      cy.dataId('halfHour-container', 'div')
        .find('input')
        .type(options.halfHourCount);
    }
    if (options.halfHourTenPackCount) {
      cy.dataId('halfHour-container', 'div')
        .find('input')
        .type(options.halfHourTenPackCount);
    }
    if (options.pairCount) {
      cy.dataId('pair-container', 'div')
        .find('input')
        .type(options.pairCount);
    }
    if (options.pairTenPackCount) {
      cy.dataId('pair-container', 'div')
        .find('input')
        .type(options.pairTenPackCount);
    }
    cy.get('form').submit();
    cy.wait('@purchase').wait(500);
    cy.wait('@fetchpurchases').wait(500);
  };

  const refundSessions = options => {
    /* prettier-ignore-start */
    cy.log(`======================================================`);
    cy.log(
      `${options.index || ''}======Refunding Sessions for ${
        options.client.LNF
      } ======`,
    );
    cy.log(`======================================================`);
    /* prettier-ignore-end */

    goToPurchasesList({ client: options.client });
    cy.get('tr.ant-table-row-level-0:last')
      .find('.ant-table-row-expand-icon')
      .click();
    cy.get('.ant-table-thead input').click();
    cy.get('button')
      .contains('Submit Refund')
      .click();

    cy.get('button')
      .contains('OK')
      .click({ force: true });
  };

  const goToPurchasesList = options => {
    /* prettier-ignore-start */
    cy.log(`======================================================`);
    cy.log(`${options.index || ''}======Go To Purchase List======`);
    cy.log(`======================================================`);
    /* prettier-ignore-end */
    cy.navTo('Clients');
    cy.wait('@fetchAllClients');
    const row = cy
      .get('.ant-table-row-level-0')
      .find('span')
      .contains(options.client.LN)
      .closest('tr');
    row.find('td:last a.list__cell__link span').click();
    cy.wait('@fetchpurchases').wait(500);
  };

  const verifyAppointments = options => {
    /* prettier-ignore-start */
    cy.log(`======================================================`);
    cy.log(
      `${options.index || ''}======Verifiying All Available Sessions======`,
    );
    cy.log(`======================================================`);
    /* prettier-ignore-end */
    cy.navTo('Trainer Verification');
    cy.wait('@fetchUnverifiedAppointments').wait(500);

    cy.get('div.ant-table-selection input').click();
    cy.get('button.contentHeader__button')
      .contains('Submit Verification')
      .click();

    cy.get('button')
      .contains('OK')
      .click({ force: true });
    cy.wait('@verifyappointments');
  };

  const signOut = options => {
    /* prettier-ignore-start */
    cy.log(`======================================================`);
    cy.log(`${options.index || ''}======Sign current user out======`);
    cy.log(`======================================================`);
    /* prettier-ignore-end */

    cy.dataId('signOut', 'a').click();
    cy.wait('@signout');
  };

  const scheduleAppointmentInPastButDontReconcile = options => {
    /* prettier-ignore-start */ scheduleAppointmentInPastButDontReconcile;
    cy.log(`======================================================`);
    cy.log(
      `${options.index ||
        ''}======schedule appointment in past but don't reconcile======`,
    );
    cy.log(`======================================================`);
    /* prettier-ignore-end */
    const entityName = Cypress.moment(options.date).format('YYYYMMDD');
    let payload = {
      appointmentType: options.appointmentType,
      date: options.date,
      startTime: options.startTime,
      endTime: options.endTime,
      trainerId: options.trainerId,
      clients: options.clientId,
      locationId: options.locationId,
      entityName,
    };
    cy.request('POST', `${apiHost}/appointment/scheduleappointment`, payload);

    // goto verify appointmnets make sure there are none
    // post to the appointmentStatusUpdate
    // check verify appointment, should show the appointment
  };

  const selectDate = options => {
    cy.dataId(options.dateContainerName, 'div')
      .find('input')
      .click();
    checkDatePickerForCorrectMonth(options.newDate).then(() => {
      cy.get(
        `[title="${options.newDate.format(
          'MMMM D, YYYY',
        )}"] > .ant-calendar-date`,
      ).click();
    });
  };

  setupRoutes(cy);

  return {
    changeAppointment,
    checkClientInventory,
    checkPayTrainer,
    checkSessions,
    checkTrainerPayment,
    checkVerification,
    cleanDB,
    clickOnAppointment,
    createAppointment,
    deleteAllAppointments,
    deleteAppointment,
    getAppointmentId,
    goToPurchasesList,
    loginAdmin,
    loginTrainer,
    manuallyLoginTrainer,
    navToAppropriateWeek,
    payTrainer,
    purchaseSessions,
    refundSessions,
    scheduleAppointmentInPastButDontReconcile,
    signOut,
    verifyAppointments,
    selectDate,
  };
};
