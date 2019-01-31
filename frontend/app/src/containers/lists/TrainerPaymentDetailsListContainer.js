import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TrainerPaymentDetailsList from '../../components/lists/TrainerPaymentDetailsList';
import moment from 'moment';
import { fetchTrainerPaymentDetails } from './../../modules/trainerPaymentDetailModule';
import decamelize from 'decamelize';

class TrainerPaymentDetailsListContainer extends Component {
  UNSAFE_componentWillMount() {
    this.loadData();
  }

  loadData() {
    this.props.fetchTrainerPaymentDetails(this.props.paymentId);
  }

  render() {
    return <TrainerPaymentDetailsList {...this.props} />;
  }
}

TrainerPaymentDetailsListContainer.propTypes = {
  gridConfig: PropTypes.object,
  fetchTrainerPaymentDetails: PropTypes.func,
  paymentId: PropTypes.string,
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
  moment.locale('en');
  let payment = state.trainerPaymentDetail.find(
    x => x.paymentId === props.params.paymentId,
  );
  let dataSource = [];
  if (payment && payment.paidAppointments) {
    dataSource = payment ? payment.paidAppointments : [];
    dataSource = dataSource.map(x => ({
      ...x,
      appointmentType: decamelize(x.appointmentType, ' ')
        .split(' ')
        .map(ap => ap[0].toUpperCase() + ap.slice(1))
        .join(' '),
      appointmentDate: moment(x.appointmentDate).format('L'),
      startTime: moment(x.startTime).format('hh:mm A'),
    }));
  }
  const gridConfig = {
    columns,
    dataSource,
  };
  return {
    gridConfig,
    paymentId: props.params.paymentId,
    paymentTotal: payment ? payment.paymentTotal : 0,
    paymentDate: payment ? moment(payment.paymentDate).format('L') : '',
  };
}

export default connect(
  mapStateToProps,
  { fetchTrainerPaymentDetails },
)(TrainerPaymentDetailsListContainer);
