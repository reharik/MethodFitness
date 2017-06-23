import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TrainerPaymentList from '../../components/lists/TrainerPaymentList';
import moment from 'moment';
import cellLink from '../../components/GridElements/CellLink.js';
import { fetchTrainerPayments } from './../../modules/trainerPaymentModule';

class TrainerPaymentListContainer extends Component {
  componentWillMount() {
    this.loadData();
  }

  loadData() {
    this.props.fetchTrainerPayments();
  }

  render() {
    return (<TrainerPaymentList {...this.props} />);
  }
}

TrainerPaymentListContainer.propTypes = {
  gridConfig: PropTypes.object,
  fetchTrainerPayments: PropTypes.func
};

const columns = [
  {
    render: (value, row) => { // eslint-disable-line no-unused-vars
      return cellLink('trainerPayment')(value, row);
    },
    dataIndex: 'date',
    title: 'Payment Date',
    width: '20%'
  }
];

function mapStateToProps(state) {
  moment.locale('en');
  let dataSource = state.trainerPayment
    .map(x => ({
      date: moment(x.date).format('MM/DD/YYYY')
    }));

  const gridConfig = {
    columns,
    dataSource
  };
  return {
    gridConfig
  };
}

export default connect(mapStateToProps, {
  fetchTrainerPayments
})(TrainerPaymentListContainer);
