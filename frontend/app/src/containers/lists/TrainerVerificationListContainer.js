import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TrainerVerificationList from '../../components/lists/TrainerVerificationList';
import moment from 'moment';

import { fetchAppointmentsAction } from './../../modules/trainerVerificationModule';

class TrainerVerificationListContainer extends Component {
  componentWillMount() {
    this.loadData();
  }

  loadData() {
    this.props.fetchAppointmentsAction(this.props.trainerId);
  }

  render() {
    return (<TrainerVerificationList gridConfig={this.props.gridConfig} />);
  }
}

TrainerVerificationListContainer.propTypes = {
  gridConfig: PropTypes.object,
  fetchAppointmentsAction: PropTypes.func,
  trainerId: PropTypes.string
};

// trainerId: trainer.id,
//   clientId: client.id,
//   clientName: `${client.firstName} ${client.lastName}`,
//   appointmentId: appointment.id,
//   appointmentDate: appointment.date,
//   appointmentStartTime: appointment.date,
//   appointmentType: appointment.appointmentType,
//   sessionId: session ? session.id : 0,
//   pricePerSession: session ? session.purchasePrice : 0,
//   trainerPercentage: TCR ? TCR.rate : 0,
//   trainerPay: TR,
//   verified: false,
//   funded: !!session


const columns = [
  {
    dataIndex: 'clientName',
    title: 'Client Name'
  },
  {
    dataIndex: 'appointmentDate',
    title: 'Date'
  },
  {
    dataIndex: 'appointmentStartTime',
    title: 'Start Time'
  },
  {
    dataIndex: 'appointmentType',
    title: 'Type'
  },
  {
    dataIndex: 'pricePerSession',
    title: 'Cost'
  },
  {
    dataIndex: 'trainerPercentage',
    title: 'Percent'
  },
  {
    dataIndex: 'Pay',
    title: 'Client Name'
  }
];

function mapStateToProps(state, props) {
  moment.locale('en');
  const gridConfig = {
    columns,
    dataSource: state.trainerVerifications.filter(x => !x.verified)
  };
  return {
    gridConfig,
    trainerId: props.params.trainerId
  };
}

export default connect(mapStateToProps, { fetchAppointmentsAction })(TrainerVerificationListContainer);
