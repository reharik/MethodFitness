const convertToHoursAndMin = time => {
  let hour = parseInt(time.substring(0, time.indexOf(':')));
  let min = parseInt(time.substring(time.indexOf(':') + 1, time.indexOf(' ')));
  let A = time.substring(time.indexOf(' ') + 1);
  hour = A === 'AM' || hour === 12 ? hour : hour + 12;
  return { hour, min, A };
};

export function buildMomentFromDateAndTime(date, time) {
  Cypress.moment.locale('en');
  if (!date || !time) {
    return undefined;
  }
  let normalizedTime = time;
  if (Cypress.moment.isMoment(time)) {
    normalizedTime = time.format('HH:mm A');
  } else if (time.length > 8) {
    normalizedTime = Cypress.moment(time).format('HH:mm A');
  }

  let hourMin = convertToHoursAndMin(normalizedTime);

  return Cypress.moment(date)
    .hour(hourMin.hour)
    .minute(hourMin.min);
}

export function syncApptTypeAndTime(apptType, startTime) {
  Cypress.moment.locale('en');
  const time = Cypress.moment(startTime, 'hh:mm A');
  let endTime;
  if (apptType === 'halfHour') {
    endTime = time.add(30, 'm');
  }
  if (apptType === 'fullHour' || apptType === 'pair') {
    endTime = time.add(60, 'm');
  }
  return endTime.format('h:mm A');
}
