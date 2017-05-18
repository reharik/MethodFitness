import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import AppointmentForm from '../../components/forms/AppointmentForm';
import { scheduleAppointment } from './../../modules/appointmentModule';
import { notifications } from './../../modules/notificationModule';
import appointmentTypes from './../../constants/appointmentTypes';
import { generateAllTimes } from './../../utilities/appointmentTimes';
import { appointmentModel, copyAppointmentModel } from './../../selectors/appointmentModelSelector';
import { actions as notifActions } from 'redux-notifications';
const { notifClear } = notifActions;

const mapStateToProps = (state, ownProps) => {
  const clients = state.clients
    .filter(x => !x.archived)
    .map(x => ({ value: x.id, display: `${x.contact.lastName} ${x.contact.firstName}` }));

  // please put this shit in a config somewhere
  const times = generateAllTimes(15, 7, 7);

  let props = {
    model: ownProps.copy ? copyAppointmentModel(state, ownProps.args) : appointmentModel(state, ownProps.args),
    clients,
    appointmentTypes,
    times,
    cancel: ownProps.cancel,
    isAdmin: state.auth.user.role === 'admin',
    trainers: state.trainers
      .filter(x => !x.archived)
      .map(x => ({ value: x.id, display: `${x.contact.lastName} ${x.contact.firstName}` }))
  };

  if (!props.isAdmin) {
    let user = state.trainers.find(x => x.id === state.auth.user.id);
    let clients = !props.model.clients.value ? user.clients : user.clients.concat(props.model.clients.value);
    props.clients = props.clients.filter(x => clients.some(c => x.value === c));
  }

  return props;
};

export default connect(mapStateToProps, {
  scheduleAppointment,
  notifications,
  notifClear
})(AppointmentForm);
