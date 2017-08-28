import { connect } from 'react-redux';
import ToggleTrainerListForContainer from '../components/ToggleTrainerListForCalendar';
import { toggleTrainerListForCalendar } from './../modules/toggleTrainerListForCalendarModule';

function mapStateToProps(state) {
  return {
    items: state.trainers
      .filter(x => !x.archived)
      .map(x => ({ name: `${x.contact.lastName}, ${x.contact.firstName.substr(0, 1)}`, id: x.trainerId }))
  };
}

export default connect(mapStateToProps, { toggleTrainerListForCalendar })(ToggleTrainerListForContainer);
