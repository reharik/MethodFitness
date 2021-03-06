module.exports = (moment, _time, past, length) => {
  let date;
  const today = moment();

  const setTime = (number, time) => {
    if (past && today.day() === 1) {
      return moment()
        .subtract(number || 2, 'hour')
        .startOf('hour')
        .format('h:mm A');
    } else if (!past && today.day() === 7) {
      return moment()
        .add(2, 'hour')
        .startOf('hour')
        .format('h:mm A');
    }
    return number
      ? moment('3:30 PM', 'h:mm A')
          .add(number, 'hour')
          .format('h:mm A')
      : time || '3:30 PM';
  };

  const time = setTime(null, _time);
  if (past) {
    if (today.day() === 1) {
      date = moment();
    } else {
      date = moment().subtract(1, 'day');
    }
  } else {
    if (today.day() === 0) {
      date = moment();
    } else {
      date = moment().add(1, 'day');
    }
  }

  return {
    date,
    time,
    setTime,
  };
};
