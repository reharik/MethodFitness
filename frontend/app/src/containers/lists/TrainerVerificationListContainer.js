import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TrainerVerificationList from '../../components/lists/TrainerVerificationList';
import moment from 'moment';
import sortBy from 'sort-by';
import { fetchUnverifiedAppointments, verifyAppointments } from '../../modules/sessionVerificationModule';

class TrainerVerificationListContainer extends Component {
  componentWillMount() {
    this.loadData();
  }

  loadData() {
    this.props.fetchUnverifiedAppointments();
  }

  render() {
    return (<TrainerVerificationList
      verifyAppointments={this.props.verifyAppointments}
      gridConfig={this.props.gridConfig} />);
  }
}

TrainerVerificationListContainer.propTypes = {
  gridConfig: PropTypes.object,
  fetchUnverifiedAppointments: PropTypes.func,
  verifyAppointments: PropTypes.func
};

function mapStateToProps(state) {
  moment.locale('en');
  let dataSource = state.sessionVerification
    .filter(x => !x.verified)
    .map(x => ({
      ...x,
      appointmentDate: moment(x.appointmentDate).format('L'),
      appointmentStartTime: moment(x.appointmentStartTime).format('hh:mm A')
    })).sort(sortBy('clientName', 'appointmentDate', 'appointmentTime'));

  const gridConfig = {
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
