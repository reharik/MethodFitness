import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TrainerVerificationList from '../../components/lists/TrainerVerificationList';
import moment from 'moment';

import { fetchUnverifiedAppointments, verifyAppointments } from '../../modules/sessionPaymentModule';

class TrainerVerificationListContainer extends Component {
  componentWillMount() {
    this.loadData();
  }

  loadData() {
    this.props.fetchUnverifiedAppointments();
  }

  render() {
    return (<TrainerVerificationList {...this.props} />);
  }
}

TrainerVerificationListContainer.propTypes = {
  gridConfig: PropTypes.object,
  fetchUnverifiedAppointments: PropTypes.func,
  verifyAppointments: PropTypes.func
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
  let dataSource = state.sessionPayment
    .filter(x => !x.verified)
    .map(x => ({
      ...x,
      appointmentDate: moment(x.appointmentDate).format('MM/DD/YYYY'),
      appointmentStartTime: moment(x.appointmentStartTime).format('hh:mm A')
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
  fetchUnverifiedAppointments,
  verifyAppointments
})(TrainerVerificationListContainer);
