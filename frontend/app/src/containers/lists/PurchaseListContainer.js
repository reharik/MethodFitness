import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PurchaseList from '../../components/lists/PurchaseList';
import moment from 'moment';

import { getPurchases, refundSessions } from './../../modules/purchaseModule';

class PurchaseListContainer extends Component {
  componentDidMount() {
    this.loadData();
  }

  loadData() {
    this.props.getPurchases(this.props.clientId);
  }

  render() {
    return <PurchaseList {...this.props} />;
  }
}

PurchaseListContainer.propTypes = {
  gridConfig: PropTypes.object,
  getPurchases: PropTypes.func,
  clientId: PropTypes.string,
  isAdmin: PropTypes.bool,
};

const columns = [
  {
    render: val => (val ? moment(val).format('L') : val), // eslint-disable-line no-confusing-arrow
    dataIndex: 'purchaseDate',
    title: 'Purchase Date',
  },
  {
    render: val => (val ? `$${val}` : val), // eslint-disable-line no-confusing-arrow
    dataIndex: 'purchaseTotal',
    title: 'Total',
  },
];

function mapStateToProps(state, props) {
  moment.locale('en');
  const isAdmin = state.auth.user.role === 'admin';
  const dataSource = state.purchases.filter(
    x => x.clientId === props.params.clientId,
  );

  const gridConfig = {
    columns,
    dataSource,
  };
  return {
    isAdmin,
    gridConfig,
    clientId: props.params.clientId,
  };
}

export default connect(
  mapStateToProps,
  { getPurchases, refundSessions },
)(PurchaseListContainer);
