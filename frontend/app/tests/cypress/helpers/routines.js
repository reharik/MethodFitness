import getMenuItems from "../../../src/utilities/menuItems";

module.exports = (cy, Cypress, moment) => {
  const apptDT = require("./getDateTimeFromDisplayPopup")(
    cy,
    Cypress,
    moment
  );

  const _changeClients = options => {
    cy.log(`------changing client-------`);

    if (
      !!options.currentClient &&
      !!options.newClient
    ) {
      cy.log(`----changing client----`);
      cy.dataId("clients-container", "div")
        .find("li.ant-select-selection__choice")
        .contains(options.currentClient.LNF)
        .closest("li")
        .find(
          "span.ant-select-selection__choice__remove"
        )
        .click();
      cy.get(".ant-select-dropdown-menu-item")
        .contains(options.newClient.LNF)
        .click();
      cy.get("#clients").blur();
    }
    if (!!options.removeClient) {
      cy.log(`----removing client----`);
      cy.dataId("clients-container", "div")
        .find("li.ant-select-selection__choice")
        .contains(options.removeClient.LNF)
        .closest("li")
        .find(
          "span.ant-select-selection__choice__remove"
        )
        .click();
      cy.get("#clients").blur();
    }
    if (
      !!options.currentClient &&
      !!options.client2
    ) {
      cy.log(`----adding client for pair----`);
      cy.get("#clients").click();
      cy.get(".ant-select-dropdown-menu-item")
        .contains(options.client2.LNF)
        .click();
      cy.get("#clients").blur();
    }
    if (
      !!options.newClient &&
      !!options.newClient2
    ) {
      cy.log(`----changing both clients----`);
      cy.dataId("clients-container", "div")
        .get("li.ant-select-selection__choice")
        .each(item =>
          cy
            .wrap(item)
            .find(
              "span.ant-select-selection__choice__remove"
            )
            .click()
        );
      cy.get("#clients").click();
      cy.get(".ant-select-dropdown-menu-item")
        .contains(options.newClient.LNF)
        .click();
      cy.get(".ant-select-dropdown-menu-item")
        .contains(options.newClient2.LNF)
        .click();
    }
  };

  const checkDatePickerForCorrectMonth = targetDate => {
    const targetMonth = targetDate.format("MMM");
    const nextMonth = Cypress.moment(targetDate)
      .add(1, "month")
      .format("MMM");
    const lastMonth = Cypress.moment(targetDate)
      .subtract(1, "month")
      .format("MMM");
    cy.get(".ant-calendar-month-select", {
      log: false
    })
      .invoke("text")
      .as("currMonth");
    return cy
      .get("@currMonth", { log: false })
      .then(sow => {
        if (
          sow !== targetMonth &&
          sow === nextMonth
        ) {
          cy.get(
            ".ant-calendar-prev-month-btn"
          ).click();
        } else if (
          sow !== targetMonth &&
          sow === lastMonth
        ) {
          cy.get(
            ".ant-calendar-next-month-btn"
          ).click();
        }
      });
  };

  const changeAppointment = options => {
    //TODO refactor me please
    // prettier-ignore-start */
    cy.log(
      `======================================================`
    );
    cy.log(
      `${options.index ||
        ""}======Changing Appointment======`
    );
    cy.log(
      `======================================================`
    );
    /* prettier-ignore-end */
    cy.navTo("Calendar");
    cy.clickOnAppointment(
      options.date,
      options.time
    );
    cy.get(`.form__footer__button`)
      .contains("Edit")
      .click();

    _changeClients(options);

    if (options.newTrainer) {
      cy.log(`----changing Trainer----`);
      cy.get("#trainerId").click({ force: true });
      cy.get(".ant-select-dropdown-menu-item")
        .contains(options.newTrainer.LNF)
        .click();
    }

    if (!!options.appointmentType) {
      cy.log(`----changing appointment type----`);
      cy.get("#appointmentType").click({
        force: true
      });
      cy.get(".ant-select-dropdown-menu-item")
        .contains(options.appointmentType)
        .click();
    }
    if (!!options.notes) {
      cy.log(`----changing notes----`);
      cy.get("#notes").type(options.notes);
    }

    if (!!options.newDate) {
      cy.log(`----changing date----`);
      cy.dataId("date-container", "div")
        .find("input")
        .click();
      checkDatePickerForCorrectMonth(
        options.newDate
      ).then(() => {
        cy.get(
          `[title="${options.newDate.format(
            "MM/DD/YYYY"
          )}"] > .ant-calendar-date`
        ).click();
        cy.get("form").submit();
        cy.wait(
          "@updateAppointmentFromPast"
        ).wait(3000);
      });
    } else {
      cy.get("form").submit();
      cy.wait("@updateAppointmentFromPast").wait(
        3000
      );
    }
  };

  const checkClientInventory = options => {
    /* prettier-ignore-start */
    cy.log(
      `======================================================`
    );
    cy.log(
      `${options.index || ""}======Checking ${
        options.client.LNF
      } Inventory======`
    );
    cy.log(
      `======================================================`
    );
    /* prettier-ignore-end */
    cy.navTo("Clients");
    cy.wait("@fetchAllClients");
    cy.get(".ant-table-row-level-0 span")
      .contains(options.client.LN)
      .closest("tr")
      .find(
        ":nth-child(1) > .list__cell__link > span"
      )
      .click();
    cy.wait("@getClient");
    if (options.fullHourCount) {
      cy.dataId("clientInventory", "div")
        .find(`span[data-id='fullHour']`)
        .contains(options.fullHourCount);
    }
    if (options.halfHourCount) {
      cy.dataId("clientInventory", "div")
        .find(`span[data-id='halfHour']`)
        .contains(options.halfHourCount);
    }
    if (options.pairCount) {
      cy.dataId("clientInventory", "div")
        .find(`span[data-id='pair']`)
        .contains(options.pairCount);
    }
  };

  const checkPayTrainer = options => {
    /* prettier-ignore-start */
    cy.log(
      `======================================================`
    );
    cy.log(
      `${options.index ||
        ""}======Checking Available To Pay Trainer======`
    );
    cy.log(
      `======================================================`
    );
    /* prettier-ignore-end */
    cy.navTo("Trainers");
    cy.get(".ant-table-row-level-0 td")
      .contains(options.trainer.FN)
      .closest("tr")
      .find("td:last a.list__cell__link")
      .click();
    if (options.payableCount > 0) {
      cy.get(".ant-table-row").should(
        "have.length",
        options.payableCount
      );
    } else {
      cy.get(".ant-table-row").should(
        "not.exist"
      );
    }
  };

  const checkSessions = options => {
    /* prettier-ignore-start */
    cy.log(
      `======================================================`
    );
    cy.log(
      `${options.index ||
        ""}======Checking Sessions for ${
        options.client.LNF
      } ======`
    );
    cy.log(
      `======================================================`
    );
    /* prettier-ignore-end */

    cy.goToPurchasesList(options.client);
    cy.get("tr.ant-table-row-level-0:last")
      .find(".ant-table-row-expand-icon")
      .click();
    if (options.usedCount) {
      cy.get("tr.row-gray").should(
        "have.length",
        options.usedCount
      );
    }
    if (options.usedItemsValues) {
      cy.get(".ant-table-row > :nth-child(5)")
        .contains(
          options.usedItemsValues.appointmentType
        )
        .should("exist");
      cy.get(".ant-table-row > :nth-child(3)")
        .contains(
          options.usedItemsValues.date.format(
            "MM/DD/YYYY"
          )
        )
        .should("exist");
      if (options.usedItemsValues.startTime) {
        cy.get(".ant-table-row > :nth-child(4)")
          .contains(
            options.usedItemsValues.startTime
          )
          .should("exist");
      }
    }
    if (options.availableCount) {
      // find class for available
      cy.get(
        "tr.ant-table-expanded-row .ant-table-row"
      )
        .not(".row-gray")
        .should(
          "have.length",
          options.availableCount
        );
    }
  };

  const checkTrainerPayment = options => {
    /* prettier-ignore-start */
    cy.log(
      `======================================================`
    );
    cy.log(
      `${options.index ||
        ""}======Checking Trainer Payment======`
    );
    cy.log(
      `======================================================`
    );
    /* prettier-ignore-end */
    cy.navTo("Payment History");
    cy.wait("@trainerpayments");
    cy.get(".ant-table-row:last")
      .find("span")
      .contains(
        Cypress.moment().format("MM/DD/YYYY")
      )
      .click();
    cy.wait("@trainerpaymentdetails");
    cy.get(".ant-table-row").should(
      "have.length",
      options.appointmentCount
    );
    cy.get(
      ".ant-table-row > :nth-child(1)"
    ).contains(
      options.appointmentValues.client.LNF
    );
    cy.get(".ant-table-row > :nth-child(4)")
      .contains(
        options.appointmentValues.appointmentType
      )
      .should("exist");
    cy.get(".ant-table-row > :nth-child(2)")
      .contains(
        options.appointmentValues.date.format(
          "MM/DD/YYYY"
        )
      )
      .should("exist");
    if (options.appointmentValues.startTime) {
      cy.get(
        ".ant-table-row > :nth-child(3)"
      ).contains(
        options.appointmentValues.startTime
      );
    }
    if (options.appointmentValues2) {
      cy.get(
        ".ant-table-row > :nth-child(1)"
      ).contains(
        options.appointmentValues2.client.LNF
      );
      cy.get(".ant-table-row > :nth-child(4)")
        .contains(
          options.appointmentValues2
            .appointmentType
        )
        .should("exist");
      cy.get(".ant-table-row > :nth-child(2)")
        .contains(
          options.appointmentValues2.date.format(
            "MM/DD/YYYY"
          )
        )
        .should("exist");
      if (options.appointmentValues2.startTime) {
        cy.get(
          ".ant-table-row > :nth-child(3)"
        ).contains(
          options.appointmentValues2.startTime
        );
      }
    }
  };

  const checkVerification = options => {
    /* prettier-ignore-start */
    cy.log(
      `======================================================`
    );
    cy.log(
      `${options.index ||
        ""}======Checking Verification======`
    );
    cy.log(
      `======================================================`
    );
    /* prettier-ignore-end */
    cy.navTo("Trainer Verification");
    cy.wait("@fetchUnverifiedAppointments").wait(
      1000
    );
    if (options.inarrearsCount) {
      cy.get("tr.row-in-arrears").should(
        "have.length",
        options.inarrearsCount
      );
    }
    if (options.availableCount) {
      // find proper class for available
      cy.get("tr.ant-table-row")
        .not(".row-in-arrears")
        .should(
          "have.length",
          options.availableCount
        );
    }
    if (options.availableItemValues) {
      cy.get(".ant-table-row")
        .not(".row-in-arrears")
        .get(":nth-child(2)")
        .contains(
          options.availableItemValues.client.LNF
        );
      cy.get(".ant-table-row")
        .not(".row-in-arrears")
        .get(":nth-child(5)")
        .contains(
          options.availableItemValues
            .appointmentType
        );
      cy.get(".ant-table-row")
        .not(".row-in-arrears")
        .get(":nth-child(3)")
        .contains(
          options.availableItemValues.date.format(
            "MM/DD/YYYY"
          )
        );
      if (options.availableItemValues.startTime) {
        cy.get(".ant-table-row")
          .not(".row-in-arrears")
          .get(":nth-child(4)")
          .contains(
            options.availableItemValues.startTime
          );
      }
    }
    if (options.availableItemValues2) {
      cy.get(".ant-table-row")
        .not(".row-in-arrears")
        .get(":nth-child(2)")
        .contains(
          options.availableItemValues2.client.LNF
        );
      cy.get(".ant-table-row")
        .not(".row-in-arrears")
        .get(":nth-child(5)")
        .contains(
          options.availableItemValues2
            .appointmentType
        );
      cy.get(".ant-table-row")
        .not(".row-in-arrears")
        .get(":nth-child(3)")
        .contains(
          options.availableItemValues2.date.format(
            "MM/DD/YYYY"
          )
        );
      if (
        options.availableItemValues2.startTime
      ) {
        cy.get(".ant-table-row")
          .not(".row-in-arrears")
          .get(":nth-child(4)")
          .contains(
            options.availableItemValues2.startTime
          );
      }
    }
    if (options.inarrearsItemValues) {
      cy.get(".row-in-arrears > :nth-child(2)")
        .contains(
          options.inarrearsItemValues.client.LNF
        )
        .should("exist");
      cy.get(".row-in-arrears > :nth-child(5)")
        .contains(
          options.inarrearsItemValues
            .appointmentType
        )
        .should("exist");
      cy.get(".row-in-arrears > :nth-child(3)")
        .contains(
          options.inarrearsItemValues.date.format(
            "MM/DD/YYYY"
          )
        )
        .should("exist");
      if (options.inarrearsItemValues.startTime) {
        cy.get(
          ".row-in-arrears > :nth-child(4)"
        ).contains(
          options.inarrearsItemValues.startTime
        );
      }
    }
    if (options.inarrearsItemValues2) {
      cy.get(".row-in-arrears > :nth-child(2)")
        .contains(
          options.inarrearsItemValues2.client.LNF
        )
        .should("exist");
      cy.get(".row-in-arrears > :nth-child(5)")
        .contains(
          options.inarrearsItemValues2
            .appointmentType
        )
        .should("exist");
      cy.get(".row-in-arrears > :nth-child(3)")
        .contains(
          options.inarrearsItemValues2.date.format(
            "MM/DD/YYYY"
          )
        )
        .should("exist");
      if (
        options.inarrearsItemValues2.startTime
      ) {
        cy.get(
          ".row-in-arrears > :nth-child(4)"
        ).contains(
          options.inarrearsItemValues2.startTime
        );
      }
    }
    if (options.noInarrears) {
      // const rows = Cypress.$(`.ant-table-row`);
      // if (rows.length > 0) {
      cy.get(
        ".ant-table-row.row-in-arrears"
      ).should("not.exist");
      // }
    }
    if (options.noAvailable) {
      Cypress.$(`.ant-table-row`).each(row => {
        cy.wrap(row)
          .find(".row-in-arrears")
          .should("not.exist");
      });
    }
  };

  const clickOnAppointment = options => {
    /* prettier-ignore-start */
    cy.log(
      `======================================================`
    );
    cy.log(
      `${options.index ||
        ""}======Click On Appointment: ${options.date.toString()}======`
    );
    cy.log(
      `======================================================`
    );
    /* prettier-ignore-end */

    navToAppropriateWeek(options.date);
    const appointment = cy.get(`ol[data-id='${options.date.format(
      "ddd MM/DD"
    )}']
 li[data-id='${
   options.time
 }'] .redux__task__calendar__task__item`);
    appointment.click();
  };

  const createAppointment = options => {
    /* prettier-ignore-start */
    cy.log(
      `======================================================`
    );
    cy.log(
      `${options.index ||
        ""}======Creating an Appointment: ${options.date.toString()}======`
    );
    cy.log(
      `======================================================`
    );
    /* prettier-ignore-end */

    navToAppropriateWeek(options.date);
    cy.get(
      `ol[data-id='${options.date.format(
        "ddd MM/DD"
      )}'] li[data-id='${options.time}']`
    ).click();

    cy.get("#clients").click();
    cy.get(".ant-select-dropdown-menu-item")
      .contains(options.client.LNF)
      .click();
    if (options.client2) {
      cy.get(".ant-select-dropdown-menu-item")
        .contains(options.client2.LNF)
        .click();
    } else if (options.appointmentType) {
      cy.get("#appointmentType")
        .focus({ log: false })
        .click({ force: true });
      cy.get(".ant-select-dropdown-menu-item")
        .contains(options.appointmentType)
        .click({ log: false });
    }
    if (options.trainer) {
      cy.get("#trainerId")
        .focus({ log: false })
        .click({ force: true });
      cy.get(".ant-select-dropdown-menu-item")
        .contains(options.trainer.LNF)
        .click({ log: false });
    }
    cy.get("#notes").type("Hi! Everybody!");
    cy.get("form").submit();
    cy.wait(
      options.future
        ? "@scheduleAppointment"
        : "@scheduleAppointmentInPast"
    );
    cy.get("#mainCalendar").should("exist");
    cy.get(
      `ol[data-id='${options.date.format(
        "ddd MM/DD"
      )}']
 li[data-id='${
   options.time
 }'] div.redux__task__calendar__task__item`
    ).should("exist");
  };

  const deleteAllAppointments = () => {
    /* prettier-ignore-start */
    cy.log(
      `======================================================`
    );
    cy.log(`======Delete All Appointments======`);
    cy.log(
      `======================================================`
    );
    /* prettier-ignore-end */

    cy.request(
      "POST",
      "localhost:3666/appointment/cleanalltestdata"
    );
    cy.wait(2000);
  };

  const deleteAppointment = options => {
    /* prettier-ignore-start */
    cy.log(
      `======================================================`
    );
    cy.log(
      `${options.index ||
        ""}======Delete Appointment: ${options.date.toString()}======`
    );
    cy.log(
      `======================================================`
    );
    /* prettier-ignore-end */

    cy.navTo("Calendar");
    cy.clickOnAppointment(
      options.date,
      options.time
    );
    let isPast = apptDT.getMomentForAppointment();
    cy.get(`.form__footer__button`)
      .contains("Delete")
      .click();
    isPast.then(
      x =>
        x
          ? cy.wait("@deletePastAppointment")
          : cy.wait("@cancelappointment")
    );
  };

  const loginAdmin = options => {
    /* prettier-ignore-start */
    cy.log(
      `======================================================`
    );
    cy.log(
      `${options.index ||
        ""}======Admin Logging In======`
    );
    cy.log(
      `======================================================`
    );
    /* prettier-ignore-end */

    const menuData = {
      menuItems: getMenuItems("admin"),
      path: [],
      breadCrumbItems: ["Home"],
      currentItem: ""
    };
    localStorage.setItem(
      "menu_data",
      JSON.stringify(menuData)
    );
    cy.fixture("trainers").then(trainers => {
      cy.request("POST", "localhost:3666/auth", {
        userName: trainers.trainer1.userName,
        password: trainers.trainer1.password
      });
    });
  };

  const loginTrainer = options => {
    /* prettier-ignore-start */
    cy.log(
      `======================================================`
    );
    cy.log(
      `${options.index ||
        ""}======Trainer Logging In: ${
        options.trainer.LNF
      }======`
    );
    cy.log(
      `======================================================`
    );
    /* prettier-ignore-end */
    const menuData = {
      menuItems: getMenuItems("trainer"),
      path: [],
      breadCrumbItems: ["Home"],
      currentItem: ""
    };
    localStorage.setItem(
      "menu_data",
      JSON.stringify(menuData)
    );
    const {
      userName,
      password
    } = options.trainer;
    // programmatically log us in without needing the UI
    cy.request("POST", "localhost:3666/auth", {
      userName,
      password
    });
  };

  const navToAppropriateWeek = date => {
    cy.get(
      '.redux__task__calendar__week input[data-id="startOfWeek"]',
      { log: false }
    )
      .invoke("val")
      .as("sowValue");
    cy.get("@sowValue", { log: false }).then(
      sow => {
        const startOfWeek = Cypress.moment(sow)
          .add(1, "day")
          .startOf("day");
        if (date.isBefore(startOfWeek)) {
          cy.log(
            `======navigate one week back======`
          );
          cy.get(
            ".redux__task__calendar__header__date__nav > :nth-child(1)",
            { log: false }
          ).click({ log: false });
          cy.wait("@fetchAppointments", {
            log: false
          });
        }
      }
    );

    cy.get(
      '.redux__task__calendar__week input[data-id="endOfWeek"]',
      { log: false }
    )
      .invoke("val")
      .as("eowValue");
    cy.get("@eowValue", { log: false }).then(
      eow => {
        const endOfWeek = Cypress.moment(eow)
          .add(1, "day")
          .endOf("day");
        if (date.isAfter(endOfWeek)) {
          cy.log(
            `======navigate one week forward======`
          );
          cy.get(
            ".redux__task__calendar__header__date__nav > :nth-child(2)",
            { log: false }
          ).click({ log: false });
          cy.wait("@fetchAppointments", {
            log: false
          });
        }
      }
    );
  };

  const payTrainer = options => {
    /* prettier-ignore-start */
    cy.log(
      `======================================================`
    );
    cy.log(
      `${options.index ||
        ""}======Paying Trainer======`
    );
    cy.log(
      `======================================================`
    );
    /* prettier-ignore-end */
    cy.navTo("Trainers");
    cy.get(".ant-table-row-level-0 td")
      .contains(options.trainer.FN)
      .closest("tr")
      .find("td:last a.list__cell__link")
      .click();

    cy.get(
      "div.ant-table-selection input"
    ).click();
    cy.get("button.contentHeader__button")
      .contains("Submit Trainer Payment")
      .click();

    cy.log("-----CONFIRMATION_BOX-----");
    cy.get("button")
      .contains("OK")
      .click({ force: true });
    cy.wait("@paytrainer");
    cy.get("tr.row-in-arrears").should(
      "have.length",
      0
    );
  };

  const purchaseSessions = options => {
    /* prettier-ignore-start */
    cy.log(
      `======================================================`
    );
    cy.log(
      `${options.index ||
        ""}======Purchasing Sessions for ${
        options.client.LNF
      } ======`
    );
    cy.log(
      `======================================================`
    );
    /* prettier-ignore-end */

    cy.goToPurchasesList(options.client);
    cy.get(".contentHeader__button__new").click();

    if (options.fullHourCount) {
      cy.dataId("fullHour-container", "div")
        .find("input")
        .type(options.fullHourCount);
    }
    if (options.fullHourTenPackCount) {
      cy.dataId("fullHour-container", "div")
        .find("input")
        .type(options.fullHourTenPackCount);
    }
    if (options.halfHourCount) {
      cy.dataId("halfHour-container", "div")
        .find("input")
        .type(options.halfHourCount);
    }
    if (options.halfHourTenPackCount) {
      cy.dataId("halfHour-container", "div")
        .find("input")
        .type(options.halfHourTenPackCount);
    }
    if (options.pairCount) {
      cy.dataId("pair-container", "div")
        .find("input")
        .type(options.pairCount);
    }
    if (options.pairTenPackCount) {
      cy.dataId("pair-container", "div")
        .find("input")
        .type(options.pairTenPackCount);
    }
    cy.get("form").submit();
    cy.wait("@purchase").wait(500);
    cy.wait("@fetchpurchases").wait(500);
  };

  const refundSessions = options => {
    /* prettier-ignore-start */
    cy.log(
      `======================================================`
    );
    cy.log(
      `${options.index ||
        ""}======Refunding Sessions for ${
        options.client.LNF
      } ======`
    );
    cy.log(
      `======================================================`
    );
    /* prettier-ignore-end */

    cy.goToPurchasesList(options.client);
    cy.get("tr.ant-table-row-level-0:last")
      .find(".ant-table-row-expand-icon")
      .click();
    cy.get(".ant-table-thead input").click();
    cy.get("button")
      .contains("Submit Refund")
      .click();

    cy.get("button")
      .contains("OK")
      .click({ force: true });
  };

  const verifyAppointments = options => {
    /* prettier-ignore-start */
    cy.log(
      `======================================================`
    );
    cy.log(
      `${options.index ||
        ""}======Verifiying All Available Sessions======`
    );
    cy.log(
      `======================================================`
    );
    /* prettier-ignore-end */
    cy.navTo("Trainer Verification");
    cy.wait("@fetchUnverifiedAppointments").wait(
      500
    );

    cy.get(
      "div.ant-table-selection input"
    ).click();
    cy.get("button.contentHeader__button")
      .contains("Submit Verification")
      .click();

    cy.get("button")
      .contains("OK")
      .click({ force: true });
    cy.wait("@verifyappointments");
  };

  return {
    changeAppointment,
    checkClientInventory,
    checkPayTrainer,
    checkSessions,
    checkTrainerPayment,
    checkVerification,
    clickOnAppointment,
    createAppointment,
    deleteAllAppointments,
    deleteAppointment,
    loginAdmin,
    loginTrainer,
    navToAppropriateWeek,
    payTrainer,
    purchaseSessions,
    refundSessions,
    verifyAppointments
  };
};
