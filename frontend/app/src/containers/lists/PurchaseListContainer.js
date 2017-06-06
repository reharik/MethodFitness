import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PurchaseList from '../../components/lists/PurchaseList';
import cellLink from '../../components/GridElements/CellLink.js';
import moment from 'moment';

import { getPurchases } from './../../modules/purchaseModule';

class PurchaseListContainer extends Component {
  componentWillMount() {
    this.loadData();
  }

  loadData() {
    this.props.getPurchases(this.props.clientId);
  }

  render() {
    return (<PurchaseList gridConfig={this.props.gridConfig} clientId={this.props.clientId} />);
  }
}

PurchaseListContainer.propTypes = {
  gridConfig: PropTypes.object,
  getPurchases: PropTypes.func,
  clientId: PropTypes.string
};

const columns = [
  {
    render: (value, row) => {
      return cellLink('purchase')(`${moment(row.createDate).format('dddd, MMMM Do YYYY')}`, row );
    },
    dataIndex: 'createDate',
    title: 'Created Date'
  },
  {
    dataIndex: 'purchaseTotal',
    title: 'Total'
  }
];

function mapStateToProps(state, props) {
  moment.locale('en');
  const gridConfig = {
    columns,
    dataSource: state.purchase.filter(x => x.clientId === props.params.clientId)
  };
  return {
    gridConfig,
    clientId: props.params.clientId
  };
}

export default connect(mapStateToProps, { getPurchases })(PurchaseListContainer);
