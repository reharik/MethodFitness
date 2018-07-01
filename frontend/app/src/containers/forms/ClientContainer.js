import { connect } from 'react-redux';
import ClientForm from '../../components/forms/ClientForm';
import normalizeModel from './../../utilities/normalizeModel';
import states from './../../constants/states';
import sources from './../../constants/sources';
import { addClient, fetchClientAction } from './../../modules/clientModule';
import { notifications } from './../../modules/notificationModule';

const mapStateToProps = state => {
  const model = normalizeModel(state.schema.definitions.client);
  return {
    model,
    states,
    sources,
  };
};

export default connect(
  mapStateToProps,
  { addClient, notifications, fetchClientAction },
)(ClientForm);
