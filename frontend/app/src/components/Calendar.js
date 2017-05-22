import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentHeader from './ContentHeader';
import AppointmentModal from './AppointmentModal';
import { Calendar } from 'redux-task-calendar';
import AppointmentContainer from './../containers/forms/AppointmentContainer';
import UpdateAppointmentContainer from './../containers/forms/UpdateAppointmentContainer';
import ToggleTrainerListForCalendarContainer from './../containers/ToggleTrainerListContainer';
import moment from 'moment';

class MFCalendar extends Component {
  state = {
    isOpen: false,
    form: null
  };

  componentWillMount() {
    this.props.fetchClientsAction();
    this.props.fetchTrainersAction();

    this.config = {
      ...this.props.config,
      retrieveDataAction: this.props.retrieveDataAction,
      updateTaskViaDND: this.props.updateTaskViaDND,
      taskClickedEvent: this.taskClickedEvent,
      openSpaceClickedEvent: this.openSpaceClickedEvent
    };
  }

  updateAppointment = args => {
    return (
      <AppointmentModal
        isOpen={true}
        onClose={this.onClose}
        form={<UpdateAppointmentContainer args={args} cancel={this.onClose} copy={this.copyAppointment} />}
        title={this.props.title}
      />
    );
  };

  scheduleAppointment = args => (
    <AppointmentModal
      isOpen={true}
      onClose={this.onClose}
      form={<AppointmentContainer args={args} cancel={this.onClose} />}
      title={this.props.title}
    />
  );

  copyAppointment = args => {
    this.setState({
      form: (
        <AppointmentModal
          isOpen={true}
          onClose={this.onClose}
          form={<AppointmentContainer args={args} cancel={this.onClose} copy={true} />}
          title={this.props.title}
        />
      )
    });
  };

  taskClickedEvent = (id, task, calendarName) => {
    this.setState({
      form: this.updateAppointment({ apptId: id, task, calendarName })
    });
  };

  permissionToSetAppointment(date, time, isAdmin) {
    return isAdmin ||
      (moment(date).isAfter(moment(), 'day') ||
        (moment(date).isSame(moment(), 'day') && moment(time, 'h:mm A').isAfter(moment().subtract(2, 'hours'))));
  }

  openSpaceClickedEvent = (day, time, calendarName) => {
    if (!this.permissionToSetAppointment(day, time, this.props.isAdmin)) {
      // showPopup;
      return;
    }

    const formattedTime = moment(time, 'h:mm A').format('hh:mm A');
    this.setState({
      isOpen: true,
      form: this.scheduleAppointment({ day, startTime: formattedTime, calendarName })
    });
  };

  onClose = () => {
    this.setState({
      isOpen: false,
      form: null
    });
  };

  render() {
    return (
      <div id="mainCalendar">
        <ContentHeader>
          <div className="mainCalendar__header">
            <div className="mainCalendar__header__left" />
            <div className="mainCalendar__header__center" />
            <div className="mainCalendar__header__right" />
          </div>
        </ContentHeader>
        <div className="form-scroll-inner">
          <div className="mainCalendar__content__inner">
            {this.props.isAdmin ? <ToggleTrainerListForCalendarContainer /> : null}
            <Calendar config={this.config} />
          </div>
        </div>
        {this.state.form}
      </div>
    );
  }
}

MFCalendar.propTypes = {
  config: PropTypes.object,
  fetchClientsAction: PropTypes.func,
  fetchTrainersAction: PropTypes.func,
  retrieveDataAction: PropTypes.func,
  updateTaskViaDND: PropTypes.func,
  title: PropTypes.string,
  isAdmin: PropTypes.bool
};

export default MFCalendar;
