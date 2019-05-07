import { connect } from 'react-redux';
import PurchaseForm from '../../components/forms/PurchaseForm';
import normalizeModel from '../../utilities/normalizeModel';
import { purchase } from './../../modules/purchaseModule';
import { notifications } from './../../modules/notificationModule';
import { fetchClientAction } from './../../modules/clientModule';

const mapStateToProps = (state, props) => {
  const model = normalizeModel(state.schema.definitions.purchase);
  model.clientId.value = props.params.clientId;
  let client = state.clients.results.find(
    x => x.clientId === props.params.clientId,
  );

  return {
    model,
    clientFirstName: client ? client.contact.firstName : '',
    clientLastName: client ? client.contact.lastName : '',
    clientRates: client ? client.clientRates : {},
  };
};

export default connect(
  mapStateToProps,
  {
    purchase,
    notifications,
    fetchClientAction,
  },
)(PurchaseForm);
