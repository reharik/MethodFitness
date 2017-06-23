import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PurchaseDetailsList from '../../components/lists/PurchaseDetailsList';
import moment from 'moment';

import { getPurchaseDetails } from './../../modules/purchaseDetailsModule';

class PurchaseDetailsListContainer extends Component {
  componentWillMount() {
    this.loadData();
  }

  loadData() {
    this.props.getPurchaseDetails(this.props.purchaseId);
  }

  render() {
    return (<PurchaseDetailsList gridConfig={this.props.gridConfig} />);
  }
}

PurchaseDetailsListContainer.propTypes = {
  gridConfig: PropTypes.object,
  getPurchaseDetails: PropTypes.func,
  purchaseId: PropTypes.string
};

const columns = [
  {
    dataIndex: 'appointmentType',
    title: 'Appointment Type'
  },
  {
    dataIndex: 'purchasePrice',
    title: 'Total'
  }
];

function mapStateToProps(state, props) {
  moment.locale('en');
  const gridConfig = {
    columns,
    dataSource: state.purchaseDetails.filter(x => x.purchaseId === props.params.purchaseId)
  };
  return {
    gridConfig,
    purchaseId: props.params.purchaseId
  };
}

export default connect(mapStateToProps, { getPurchaseDetails })(PurchaseDetailsListContainer);
