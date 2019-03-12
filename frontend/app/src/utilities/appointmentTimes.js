import riMoment, { isMoment } from './riMoment';

export function generateAllTimes(inc, start, end) {
  let times = [];
  let startMom = riMoment()
    .hour(start)
    .minute(0);
  let endMom = riMoment()
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
  if (!date || !time) {
    return undefined;
  }
  let normalizedTime = time;
  if (isMoment(time)) {
    normalizedTime = time.format('HH:mm A');
  } else if (time.length > 8) {
  normalizedTime = convertTimeToMoment(time).format('HH:mm A');
  }

  let hourMin = convertToHoursAndMin(normalizedTime);

  return riMoment(date)
    .hour(hourMin.hour)
    .minute(hourMin.min);
}

const convertTimeToMoment = (time) => {
  const hourMin = convertToHoursAndMin(time);
  return riMoment().startOf('day').add(hourMin.hour, 'hour').add(hourMin.minute, 'minute');
};

export function syncApptTypeAndTime(apptType, startTime) {
  const time = convertTimeToMoment(startTime);
  let endTime;
  if (apptType === 'halfHour') {
    endTime = time.add(30, 'minute');
    console.log(`==========endTime.format()==========`);
    console.log(riMoment(endTime).format());
    console.log(`==========END endTime.format()==========`);
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
  const cutOffDateTime = riMoment();

  const sameDayAsCutOff = (targetDate, cutOffDT) => {
    return (
      targetDate.isSame(cutOffDT, 'day') &&
      targetDate.isAfter(riMoment(cutOffDT).add(2, 'hours'))
    );
  };

  return (
    isAdmin ||
    targetDateTime.isAfter(cutOffDateTime, 'day') ||
    sameDayAsCutOff(targetDateTime, cutOffDateTime)
  );
}
