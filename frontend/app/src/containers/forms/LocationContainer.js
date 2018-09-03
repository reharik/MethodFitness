import { connect } from 'react-redux';
import LocationForm from '../../components/forms/LocationForm';
import normalizeModel from './../../utilities/normalizeModel';
import states from './../../constants/states';
import sources from './../../constants/sources';
import {
  addLocation,
  fetchLocationAction,
} from './../../modules/locationModule';
import { notifications } from './../../modules/notificationModule';

const mapStateToProps = state => {
  const model = normalizeModel(state.schema.definitions.location);
  return {
    model,
    states,
    sources,
  };
};

export default connect(
  mapStateToProps,
  { addLocation, notifications, fetchLocationAction },
)(LocationForm);
