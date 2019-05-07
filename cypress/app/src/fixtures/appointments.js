import momenttimezone from 'moment-timezone';
function riMoment(mom) {
  return momenttimezone(mom).tz('America/New_York');
}

module.exports = (moment, _time, past) => {
  let date;
  const today = riMoment();

  const setTime = (number, time) => {
    if (past && today.day() === 1) {
      return riMoment()
        .subtract(number || 2, 'hour')
        .startOf('hour')
        .format('h:mm A');
    } else if (!past && today.day() === 7) {
      return riMoment()
        .add(2, 'hour')
        .startOf('hour')
        .format('h:mm A');
    }
    return number
      ? riMoment('3:30 PM', 'h:mm A')
          .add(number, 'hour')
          .format('h:mm A')
      : time || '3:30 PM';
  };

  const time = setTime(null, _time);
  if (past) {
    if (today.day() === 1) {
      date = riMoment();
    } else {
      date = riMoment().subtract(1, 'day');
    }
  } else {
    if (today.day() === 0) {
      date = riMoment();
    } else {
      date = riMoment().add(1, 'day');
    }
  }

  return {
    date,
    time,
    setTime,
  };
};
