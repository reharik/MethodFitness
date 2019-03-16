import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PayTrainerList from '../../components/lists/PayTrainerList';
import riMoment from './../../utilities/riMoment';

import { fetchVerifiedAppointments } from './../../modules/sessionVerificationModule';
import { submitTrainerPayment } from './../../modules/trainerPaymentModule';

class PayTrainerListContainer extends Component {
  componentDidMount() {
    this.loadData();
  }

  loadData() {
    this.props.fetchVerifiedAppointments(this.props.trainerId);
  }

  render() {
    return <PayTrainerList {...this.props} />;
  }
}

PayTrainerListContainer.propTypes = {
  gridConfig: PropTypes.object,
  fetchVerifiedAppointments: PropTypes.func,
  submitTrainerPayment: PropTypes.func,
  trainerId: PropTypes.string,
};

const columns = [
  {
    dataIndex: 'clientName',
    title: 'Client Name',
    width: '20%',
  },
  {
    dataIndex: 'appointmentDate',
    title: 'Date',
    width: '20%',
  },
  {
    dataIndex: 'startTime',
    title: 'Start Time',
    width: '15%',
  },
  {
    dataIndex: 'appointmentType',
    title: 'Type',
    width: '15%',
  },
  {
    render: val => (val ? `$${val}` : val), // eslint-disable-line no-confusing-arrow
    dataIndex: 'pricePerSession',
    title: 'Cost',
    width: '10%',
  },
  {
    render: val => (val ? `${val}%` : val), // eslint-disable-line no-confusing-arrow
    dataIndex: 'trainerPercentage',
    title: 'Percent',
    width: '10%',
  },
  {
    render: val => (val ? `$${val}` : val), // eslint-disable-line no-confusing-arrow
    dataIndex: 'trainerPay',
    title: 'Pay',
    width: '10%',
  },
];

function mapStateToProps(state, props) {
  let dataSource = state.sessionVerification
    .filter(x => x.verified)
    .map(x => {
      return {
        ...x,
        appointmentDate: riMoment(x.appointmentDate).format('L'),
        startTime: riMoment(x.appointmentStartTime).format('LT'),
      };
    });

  let trainer = state.trainers.results.find(
    x => x.trainerId === props.params.trainerId,
  );
  let trainerName = '';
  if (trainer) {
    trainerName = `${trainer.contact.firstName} ${trainer.contact.lastName}`;
  }
  const gridConfig = {
    columns,
    dataSource,
  };
  return {
    gridConfig,
    trainerName,
    trainerId: props.params.trainerId,
  };
}

export default connect(
  mapStateToProps,
  {
    fetchVerifiedAppointments,
    submitTrainerPayment,
  },
)(PayTrainerListContainer);
