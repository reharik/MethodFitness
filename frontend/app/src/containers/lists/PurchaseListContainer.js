import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PurchaseList from '../../components/lists/PurchaseList';
import riMoment from './../../utilities/riMoment';

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
    render: val => (val ? riMoment(val).format('L') : val), // eslint-disable-line no-confusing-arrow
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
  const isAdmin = state.auth.user.role === 'admin';
  const dataSource = state.purchases.find(
    x => x.clientId === props.match.params.clientId,
  );
  const gridConfig = {
    columns,
    dataSource: dataSource ? dataSource.purchases : [],
  };
  return {
    isAdmin,
    gridConfig,
    sessionsDataSource: dataSource ? dataSource.sessions : [],
    clientId: props.match.params.clientId,
  };
}

export default connect(
  mapStateToProps,
  { getPurchases, refundSessions },
)(PurchaseListContainer);
