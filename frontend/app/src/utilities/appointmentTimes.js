import moment from 'moment';

export function generateAllTimes(inc, start, end) {
  moment.locale('en');
  let times = [];
  let startMom = moment()
    .hour(start)
    .minute(0);
  let endMom = moment()
    .hour(end + 12)
    .minute(0);
  times.push({
    value: startMom.format('hh:mm A'),
    display: startMom.format('h:mm A'),
  });
  while (startMom.isBefore(endMom)) {
    startMom.add(inc, 'minutes');
    times.push({
      value: startMom.format('hh:mm A'),
      display: startMom.format('h:mm A'),
    });
  }
  return times;
}

const convertToHoursAndMin = time => {
  let hour = parseInt(time.substring(0, time.indexOf(':')));
  let min = parseInt(time.substring(time.indexOf(':') + 1, time.indexOf(' ')));
  let A = time.substring(time.indexOf(' ') + 1);
  hour = A === 'AM' || hour === 12 ? hour : hour + 12;
  return { hour, min, A };
};

export function buildMomentFromDateAndTime(date, time) {
  moment.locale('en');
  if (!date || !time) {
    return undefined;
  }
  let normalizedTime = time;
  if (moment.isMoment(time)) {
    normalizedTime = time.format('HH:mm A');
  } else if (time.length > 8) {
    normalizedTime = moment(time).format('HH:mm A');
  }

  let hourMin = convertToHoursAndMin(normalizedTime);

  return moment(date)
    .hour(hourMin.hour)
    .minute(hourMin.min);
}

export function syncApptTypeAndTime(apptType, startTime) {
  moment.locale('en');
  const time = moment(startTime, 'hh:mm A');
  let endTime;
  if (apptType === 'halfHour') {
    endTime = time.add(30, 'm');
  }
  if (apptType === 'fullHour' || apptType === 'pair') {
    endTime = time.add(60, 'm');
  }
  return endTime.format('h:mm A');
}

export function curriedPermissionToSetAppointment(isAdmin) {
  return (data, orig) => permissionToSetAppointment(data, isAdmin, orig);
}

// eslint-disable-next-line no-unused-vars
export function permissionToSetAppointment({ date, startTime }, isAdmin) {
  const targetDateTime = buildMomentFromDateAndTime(date, startTime);
  const cutOffDateTime = moment();

  const sameDayAsCutOff = (targetDate, cutOffDT) => {
    return (
      targetDateTime.isSame(cutOffDT, 'day') &&
      targetDateTime.isAfter(moment(cutOffDT).add(2, 'hours'))
    );
  };

  return (
    isAdmin ||
    targetDateTime.isAfter(cutOffDateTime, 'day') ||
    sameDayAsCutOff(targetDateTime, cutOffDateTime)
  );
}
