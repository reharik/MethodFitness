import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import TrainerPaymentDetailsList from '../../components/lists/TrainerPaymentDetailsList';
import moment from 'moment';
import {fetchTrainerPaymentDetails} from './../../modules/trainerPaymentDetailModule';

class TrainerPaymentDetailsListContainer extends Component {
  componentWillMount() {
    this.loadData();
  }

  loadData() {
    this.props.fetchTrainerPaymentDetails(this.props.paymentId);
  }

  render() {
    return (<TrainerPaymentDetailsList {...this.props} />);
  }
}

TrainerPaymentDetailsListContainer.propTypes = {
  gridConfig: PropTypes.object,
  fetchTrainerPaymentDetails: PropTypes.func,
  paymentId: PropTypes.string
};

const columns = [
  {
    dataIndex: 'clientName',
    title: 'Client Name',
    width: '20%'
  },
  {
    dataIndex: 'appointmentDate',
    title: 'Date',
    width: '20%'
  },
  {
    dataIndex: 'appointmentStartTime',
    title: 'Start Time',
    width: '15%'
  },
  {
    dataIndex: 'appointmentType',
    title: 'Type',
    width: '15%'
  },
  {
    dataIndex: 'pricePerSession',
    title: 'Cost',
    width: '10%'
  },
  {
    dataIndex: 'trainerPercentage',
    title: 'Percent',
    width: '10%'
  },
  {
    dataIndex: 'trainerPay',
    title: 'Pay',
    width: '10%'
  }
];

function mapStateToProps(state, props) {
  moment.locale('en');
  let payment = state.trainerPaymentDetail.find(x => x.paymentId === props.params.paymentId);
  let dataSource = [];
  if (payment && payment.paidAppointments) {
    dataSource = payment ? payment.paidAppointments : [];
    dataSource = dataSource.map(x => ({
      ...x,
      appointmentDate: moment(x.appointmentDate).format('MM/DD/YYYY'),
      appointmentStartTime: moment(x.appointmentStartTime).format('hh:mm A')
    }));
  }
  const gridConfig = {
    columns,
    dataSource
  };
  return {
    gridConfig,
    paymentId: props.params.paymentId,
    paymentTotal: payment ? payment.paymentTotal : 0,
    paymentDate: payment ? moment(payment.paymentDate).format('MM/DD/YYYY') : ''
  };
}

export default connect(mapStateToProps, {fetchTrainerPaymentDetails})(TrainerPaymentDetailsListContainer);
