module.exports = (cy, moment) => {

  const changeAppointment = (options) => {
    cy.log(`======================================================`);
    cy.log(`${options.index || ''}======Changing Appointment======`);
    cy.log(`======================================================`);
    cy.navTo('Calendar');
    cy.clickOnAppointment(options.date, options.time);
    cy.get(`.form__footer__button`).contains('Edit').click();
    if (!!options.currentClient && !!options.newClient) {
      cy.log(`----changing client----`);
      cy.dataId('clients-container', 'div')
        .find('li.ant-select-selection__choice')
        .contains(options.currentClient.LNF)
        .closest('li')
        .find('span.ant-select-selection__choice__remove')
        .click();
      cy
        .get('.ant-select-dropdown-menu-item')
        .contains(options.newClient.LNF)
        .click();
      cy.get('#clients').blur();
    }
    if (!!options.appointmentType) {
      cy.log(`----changing appointment type----`);
      cy.get('#appointmentType').click({force: true});
      cy
        .get('.ant-select-dropdown-menu-item')
        .contains(options.appointmentType)
        .click();
    }
    if (!!options.newDate) {
      cy.log(`----changing date----`);
      cy.dataId('date-container', 'div').find('input').click();
      cy.get(`[title="${options.newDate.format('MM/DD/YYYY')}"] > .ant-calendar-date`).click();
    }
    if (!!options.notes) {
      cy.log(`----changing notes----`);
      cy.get('#notes').type(options.notes);
    }
    cy.get('form').submit();
    cy.wait('@updateAppointmentFromPast');
  };

  const checkClientInventory = (options) => {
    cy.log(`======================================================`);
    cy.log(`${options.index || ''}======Checking ${options.client.LNF} Inventory======`);
    cy.log(`======================================================`);
    cy.navTo('Clients');
    cy.wait('@fetchAllClients');
    cy
      .get('.ant-table-row-level-0 span')
      .contains(options.client.LN)
      .closest('tr')
      .find(':nth-child(1) > .list__cell__link > span')
      .click();
    cy.wait('@getClient');
    if (options.fullHourCount) {
      cy.dataId('clientInventory', 'div').find(`span[data-id='fullHour']`).contains(options.fullHourCount);
    }
    if (options.halfHourCount) {
      cy.dataId('clientInventory', 'div').find(`span[data-id='halfHour']`).contains(options.halfHourCount);
    }
    if (options.pairCount) {
      cy.dataId('clientInventory', 'div').find(`span[data-id='pair']`).contains(options.pairCount);
    }
  };

  const checkVerification = (options) => {
    cy.log(`======================================================`);
    cy.log(`${options.index || ''}======Checking Verification======`);
    cy.log(`======================================================`);
    cy.navTo('Trainer Verification');
    cy.wait('@fetchUnverifiedAppointments').wait(1000);
    if (options.inarrearsCount) {
      cy.get('.ant-table-row').should('have.class', 'row-in-arrears');
      cy.get('tr.row-in-arrears').should('have.length', options.inarrearsCount);
    }
    if (options.availableCount) {
      // find proper class for available
      cy.get('.ant-table-row').should('not.have.class', 'row-in-arrears');
      cy.get('tr.ant-table-row').not('.row-in-arrears').should('have.length', options.availableCount);
    }
    if (options.availableItemValues) {
      cy.get('.ant-table-row > :nth-child(2)').contains(options.availableItemValues.client.LNF).should('exist');
      cy.get('.ant-table-row > :nth-child(5)').contains(options.availableItemValues.appointmentType).should('exist');
      cy.get('.ant-table-row > :nth-child(3)').contains(options.availableItemValues.date.format('MM/DD/YYYY')).should('exist');
    }
    if (options.inarrearsItemValues) {
      cy.get('.ant-table-row > :nth-child(2)').contains(options.inarrearsItemValues.client.LNF).should('exist');
      cy.get('.ant-table-row > :nth-child(5)').contains(options.inarrearsItemValues.appointmentType).should('exist');
      cy.get('.ant-table-row > :nth-child(3)').contains(options.inarrearsItemValues.date.format('MM/DD/YYYY')).should('exist');
    }
  };

  const purchaseSessions = (options) => {
    cy.log(`======================================================`);
    cy.log(`${options.index || ''}======Purchaseing Sessions for ${options.client.LNF} ======`);
    cy.log(`======================================================`);
    cy.goToPurchasesList(options.client);
    cy.get('.contentHeader__button__new').click();
    if (options.fullHourCount) {
      cy.dataId('fullHour-container', 'div').find('input').type(options.fullHourCount);
    }
    if (options.fullHourTenPackCount) {
      cy.dataId('fullHour-container', 'div').find('input').type(options.fullHourTenPackCount);
    }
    if (options.halfHourCount) {
      cy.dataId('halfHour-container', 'div').find('input').type(options.halfHourCount);
    }
    if (options.halfHourTenPackCount) {
      cy.dataId('halfHour-container', 'div').find('input').type(options.halfHourTenPackCount);
    }
    if (options.pairPackCount) {
      cy.dataId('pair-container', 'div').find('input').type(options.pairCount);
    }
    if (options.pairTenPackCount) {
      cy.dataId('pair-container', 'div').find('input').type(options.pairTenPackCount);
    }
    cy.get('form').submit();
    cy.wait('@purchase').wait(500);
    cy.wait('@fetchpurchases').wait(500);
  };

  const checkSessions = (options) => {
    cy.log(`======================================================`);
    cy.log(`${options.index || ''}======Checking Sessions for ${options.client.LNF} ======`);
    cy.log(`======================================================`);

    cy.goToPurchasesList(options.client);
    cy
      .get('tr.ant-table-row-level-0:last')
      .find('.ant-table-row-expand-icon')
      .click();
    if (options.usedCount) {
      cy.get('tr.row-gray').should('have.length', options.usedCount);
    }
    if (options.usedItemsValues) {
      cy.get('.ant-table-row > :nth-child(5)').contains(options.usedItemsValues.appointmentType).should('exist');
      cy.get('.ant-table-row > :nth-child(3)').contains(options.usedItemsValues.date.format('MM/DD/YYYY')).should('exist');
    }
    if (options.availableCount) {
      // find class for available
      cy.get('tr.ant-table-expanded-row .ant-table-row').not('.row-gray').should('have.length', options.availableCount);
    }

  };

  const refundSessions = (options) => {
    cy.log(`======================================================`);
    cy.log(`${options.index || ''}======Refunding Sessions for ${options.client.LNF} ======`);
    cy.log(`======================================================`);

    cy.goToPurchasesList(options.client);
    cy
      .get('tr.ant-table-row-level-0:last')
      .find('.ant-table-row-expand-icon')
      .click();
    cy.get('.ant-table-thead input').click();
    cy.get('button').contains('Submit Refund').click();

    cy.get('button').contains('OK').click({force: true});
  };

  const verifyAppointments = (options) => {
    cy.log(`======================================================`);
    cy.log(`${options.index || ''}======Verifiying All Available Sessions======`);
    cy.log(`======================================================`);
    cy.navTo('Trainer Verification');
    cy.wait('@fetchUnverifiedAppointments').wait(500);

    cy.get('div.ant-table-selection input').click();
    cy.get('button.contentHeader__button').contains('Submit Verification').click();

    cy.get('button').contains('OK').click({ force: true });
    cy.wait('@verifyappointments');
  };

  const checkPayTrainer = (options) => {
    cy.log(`======================================================`);
    cy.log(`${options.index || ''}======Verifiying All Available Sessions======`);
    cy.log(`======================================================`);
    cy.navTo('Trainers');
    cy.get('.ant-table-row-level-0 td')
      .contains(options.trainer.FN)
      .closest('tr')
      .find('td:last a.list__cell__link').click();
    if (options.payableCount > 0) {
      cy.get('.ant-table-row').should('have.length', options.payableCount);
    } else {
      cy.get('.ant-table-row').should('not.exist');
    }
  };

  const payTrainer = (options) => {
    cy.log(`======================================================`);
    cy.log(`${options.index || ''}======Paying Trainer======`);
    cy.log(`======================================================`);
    cy.navTo('Trainers');
    cy.get('.ant-table-row-level-0 td')
      .contains(options.trainer.FN)
      .closest('tr')
      .find('td:last a.list__cell__link')
      .click();
    cy.get('.ant-table-row').should('have.length', 1);

    cy.get('div.ant-table-selection input').click();
    cy.get('button.contentHeader__button').contains('Submit Trainer Payment').click();

    cy.log('-----CONFIRMATION_BOX-----');
    cy.get('button').contains('OK').click({ force: true });
    cy.wait('@paytrainer');
    cy.get('tr.row-in-arrears').should('have.length', 0);
  };

  const checkTrainerPayment = (options) => {
    cy.log(`======================================================`);
    cy.log(`${options.index || ''}======Checking Trainer Payment======`);
    cy.log(`======================================================`);
    cy.navTo('Payment History');
    cy.wait('@trainerpayments');
    cy
      .get('.ant-table-row:last')
      .find('span')
      .contains(Cypress.moment().format('MM/DD/YYYY'))
      .click();
    cy.wait('@trainerpaymentdetails');
    cy.get('.ant-table-row').should('have.length', options.appointmentCount);
    cy.get('.ant-table-row > :nth-child(1)').contains(options.client.LNF);
    cy.get('.ant-table-row > :nth-child(4)').contains(options.appointmentValues.appointmentType).should('exist');
    cy.get('.ant-table-row > :nth-child(2)').contains(options.appointmentValues.date.format('MM/DD/YYYY')).should('exist');
  };

  return {
    changeAppointment,
    purchaseSessions,
    checkClientInventory,
    checkSessions,
    checkVerification,
    refundSessions,
    verifyAppointments,
    checkPayTrainer,
    payTrainer,
    checkTrainerPayment
  };
};