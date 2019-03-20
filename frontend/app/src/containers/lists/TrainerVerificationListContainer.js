import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TrainerVerificationList from '../../components/lists/TrainerVerificationList';
import riMoment from './../../utilities/riMoment';
import sortBy from 'sort-by';
import {
  fetchUnverifiedAppointments,
  verifyAppointments,
} from '../../modules/sessionVerificationModule';
import decamelize from 'decamelize';

class TrainerVerificationListContainer extends Component {
  UNSAFE_componentWillMount() {
    this.loadData();
  }

  loadData() {
    this.props.fetchUnverifiedAppointments();
  }

  render() {
    return (
      <TrainerVerificationList
        verifyAppointments={this.props.verifyAppointments}
        gridConfig={this.props.gridConfig}
      />
    );
  }
}

TrainerVerificationListContainer.propTypes = {
  gridConfig: PropTypes.object,
  fetchUnverifiedAppointments: PropTypes.func,
  verifyAppointments: PropTypes.func,
};

function mapStateToProps(state) {
  let dataSource = (state.sessionVerification || [])
    .filter(x => !x.verified && x.trainerId === state.auth.user.trainerId)
    .map(x => ({
      ...x,
      // ok, looks like decamalize does not capitalize the first letter
      // of each word so the second map does that.
      appointmentType: decamelize(x.appointmentType, ' ')
        .split(' ')
        .map(w => w[0].toUpperCase() + w.slice(1))
        .join(' '),
      appointmentDate: riMoment(x.appointmentDate).format('L'),
      startTime: riMoment(x.startTime).format('hh:mm A'),
    }))
    .sort(sortBy('clientName', 'appointmentDate', 'appointmentTime'));

  const gridConfig = {
    dataSource,
  };
  return {
    gridConfig,
  };
}

export default connect(
  mapStateToProps,
  {
    fetchUnverifiedAppointments,
    verifyAppointments,
  },
)(TrainerVerificationListContainer);
