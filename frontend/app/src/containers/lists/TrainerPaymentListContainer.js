import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TrainerPaymentList from '../../components/lists/TrainerPaymentList';
import moment from 'moment';
import cellLink from '../../components/GridElements/CellLink.js';
import { fetchTrainerPayments } from './../../modules/trainerPaymentModule';

class TrainerPaymentListContainer extends Component {
  UNSAFE_componentWillMount() {
    this.loadData();
  }

  loadData() {
    this.props.fetchTrainerPayments();
  }

  render() {
    return <TrainerPaymentList {...this.props} />;
  }
}

TrainerPaymentListContainer.propTypes = {
  gridConfig: PropTypes.object,
  fetchTrainerPayments: PropTypes.func,
};

const columns = [
  {
    render: (value, row) => {
      // eslint-disable-line no-unused-vars
      return cellLink('trainerPayment', 'paymentId')(value, row);
    },
    dataIndex: 'date',
    title: 'Payment Date',
    width: '20%',
  },
  {
    render: val => (val ? `$${val}` : ''), // eslint-disable-line no-confusing-arrow
    dataIndex: 'paymentTotal',
    title: 'Payment Total',
    width: '10%',
  },
];

function mapStateToProps(state) {
  moment.locale('en');
  let trainerPayment = state.trainerPayment.find(
    x => x.trainerId === state.auth.user.trainerId,
  );
  let dataSource = trainerPayment
    ? trainerPayment.payments.map(x => ({
        paymentId: x.paymentId,
        paymentTotal: x.paymentTotal,
        date: moment(x.date).format('L'),
      }))
    : [];

  const gridConfig = {
    columns,
    dataSource,
  };
  return {
    gridConfig,
  };
}

export default connect(
  mapStateToProps,
  {
    fetchTrainerPayments,
  },
)(TrainerPaymentListContainer);
