import moment from 'moment';

const iterateTimes = (inc, morning, start = 1, end = 12) => {
  let times = [];
  for (let i = start; i <= end; i++) {
    times.push({ value: `${i < 10 ? '0' + i : i}:00 ${morning}`, display: `${i}:00 ${morning}` });
    switch (inc) {
      case 15: {
        times.push({ value: `${i < 10 ? '0' + i : i}:15 ${morning}`, display: `${i}:15 ${morning}` });
        times.push({ value: `${i < 10 ? '0' + i : i}:30 ${morning}`, display: `${i}:30 ${morning}` });
        times.push({ value: `${i < 10 ? '0' + i : i}:45 ${morning}`, display: `${i}:45 ${morning}` });
        break;
      }
      default: {
        times.push({ value: `${i < 10 ? '0' + i : i}:30 ${morning}`, display: `${i}:30 ${morning}` });
      }
    }
  }
  return times;
};

export function generateAllTimes(inc, start, end) {
  moment.locale('en');
  return iterateTimes(inc, 'AM', start).concat(iterateTimes(inc, 'PM', 1, end));
}

const convertLocalTimeToUtc = (time) => {
  let hour = parseInt(time.substring(0, time.indexOf(':'))) + (-moment().utcOffset() / 60);
  let min = parseInt(time.substring(time.indexOf(':') + 1, time.indexOf(' ')));
  let A = time.substring(time.indexOf(' ') + 1);
  hour = A === 'AM' ? hour : hour + 12;
  return {hour, min, A};
};

export function getISODateTime(date, time) {
  moment.locale('en');
  if (!date || !time) {
    return undefined;
  }
  let utcTime = convertLocalTimeToUtc(time);
  const result = moment(date).hour(utcTime.hour).minute(utcTime.min);
  return result.toISOString();
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
