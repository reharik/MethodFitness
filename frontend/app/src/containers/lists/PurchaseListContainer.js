import { connect } from 'react-redux';
import PurchaseList from '../../components/lists/PurchaseList';
import cellLink from '../../components/GridElements/CellLink.js';
import moment from 'moment';

import { getPurchases } from './../../modules/purchaseModule';

const columns = () => [
  {
    property: ({ column, row }) => { // eslint-disable-line no-unused-vars
      return cellLink('purchase')({ value: `${moment(row.createDate).format('dddd, MMMM Do YYYY')}`, row });
    },
    sort: 'createDate',
    display: 'Created Date'
  },
  {
    property: 'purchaseTotal',
    display: 'Total'
  }
];

function mapStateToProps(state, props) {
  moment.locale('en');
  const gridConfig = {
    tableName: 'purchaseList',
    dataSource: 'purchase',
    fetchDataAction: () => getPurchases(props.params.clientId)
  };
  return {
    gridConfig,
    columns,
    purchase: state.purchase.filter(x => x.clientId === props.params.clientId)
  };
}

export default connect(mapStateToProps)(PurchaseList);
