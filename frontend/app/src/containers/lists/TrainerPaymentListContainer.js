import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TrainerPaymentList from '../../components/lists/TrainerPaymentList';
import riMoment from './../../utilities/riMoment';

import cellLink from '../../components/GridElements/CellLink.js';
import { fetchTrainerPayments } from './../../modules/trainerPaymentModule';

class TrainerPaymentListContainer extends Component {
  componentDidMount() {
    this.loadData();
  }

  loadData() {
    this.props.fetchTrainerPayments(this.props.params.trainerId);
  }

  render() {
    return <TrainerPaymentList {...this.props} />;
  }
}

TrainerPaymentListContainer.propTypes = {
  params: PropTypes.object,
  gridConfig: PropTypes.object,
  fetchTrainerPayments: PropTypes.func,
};

function mapStateToProps(state, props) {
  const trainerId = props.params.trainerId || state.auth.user.trainerId;

  const columns = [
    {
      render: (value, row) => {
        // eslint-disable-line no-unused-vars
        return cellLink('trainerPaymentDetails', 'paymentId', trainerId)(
          value,
          row,
        );
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

  let trainerPayment = state.trainerPayment.find(
    x => x.trainerId === trainerId,
  );
  let dataSource = trainerPayment
    ? trainerPayment.payments.map(x => ({
        paymentId: x.paymentId,
        paymentTotal: x.paymentTotal,
        date: riMoment(x.date).format('L'),
      }))
    : [];

  let trainer = state.trainers.results.find(x => x.trainerId === trainerId);

  const gridConfig = {
    columns,
    dataSource,
  };
  return {
    gridConfig,
    trainerName: trainer
      ? `${trainer.contact.firstName} ${trainer.contact.lastName}`
      : '',
    trainerId: props.params.trainerId || state.auth.user.trainerId,
  };
}

export default connect(
  mapStateToProps,
  {
    fetchTrainerPayments,
  },
)(TrainerPaymentListContainer);
