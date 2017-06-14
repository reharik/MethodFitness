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
  let dataSource = state.trainerVerifications
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
    gridConfig,
    trainerId: props.params.trainerId
  };
}

export default connect(mapStateToProps, { fetchAppointmentsAction })(TrainerVerificationListContainer);
