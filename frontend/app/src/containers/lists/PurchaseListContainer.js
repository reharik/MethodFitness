import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PurchaseList from '../../components/lists/PurchaseList';
import moment from 'moment';

import { getPurchases, refundSessions } from './../../modules/purchaseModule';

class PurchaseListContainer extends Component {
  componentDidMount() {
    console.log(`=========="purchaselist did mount"=========`);
    console.log("purchaselist did mount"); // eslint-disable-line quotes
    console.log(`==========END "purchaselist did mount"=========`);
    this.loadData();
  }

  loadData() {
    this.props.getPurchases(this.props.clientId);
  }

  render() {
    return (<PurchaseList {...this.props} />);
  }
}

PurchaseListContainer.propTypes = {
  gridConfig: PropTypes.object,
  getPurchases: PropTypes.func,
  clientId: PropTypes.string
};


const columns = [
  {
    render: val => val ? moment(val).format('L') : val,
    dataIndex: 'purchaseDate',
    title: 'Purchase Date'
  },
  {
    render: val => val ? `$${val}` : val,
    dataIndex: 'purchaseTotal',
    title: 'Total'
  }
];

function mapStateToProps(state, props) {
  moment.locale('en');
  const dataSource = state.purchases
    .filter(x => x.clientId === props.params.clientId);

  const gridConfig = {
    columns,
    dataSource
  };
  return {
    gridConfig,
    clientId: props.params.clientId
  };
}

export default connect(mapStateToProps, { getPurchases, refundSessions })(PurchaseListContainer);
