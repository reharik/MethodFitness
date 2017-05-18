import moment from 'moment';

const defaultValues = {
  defaultView: 'month',
  dayStartsAt: moment('7:00 AM', ['h:mm A']),
  dayEndsAt: moment('7:00 PM', ['h:mm A']),
  increment: 30,
  color: 'blue',
  titleColor: 'darkblue',
  width: '',
  editable: true,
  fetchDateFormat: 'YYYYMMDD',
  displayTimeFormat: 'h:mm A',
  taskFilter: (x) => (true),
  taskMap: (x) => (x)
};

export default defaultValues
