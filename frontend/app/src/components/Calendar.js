import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentHeader from './ContentHeader';
import AppointmentModal from './AppointmentModal';
import { Calendar } from 'redux-task-calendar';
import ToggleTrainerListForCalendarContainer from './../containers/ToggleTrainerListContainer';
import moment from 'moment';

class MFCalendar extends Component {
  state = {
    isOpen: false,
    apptArgs: {}
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

  copyAppointment = args => {
    let apptArgs = {
      apptId: args.apptId,
      isCopy: true
    };
    this.setState({
      isOpen: true,
      apptArgs
    });
  };

  editAppointment = args => {
    let apptArgs = {
      apptId: args.apptId,
      isEdit: true
    };
    this.setState({
      isOpen: true,
      apptArgs
    });
  };

  taskClickedEvent = (id, task, calendarName) => {
    let apptArgs = { apptId: id, task, calendarName };
    this.setState({
      isOpen: true,
      apptArgs
    });
  };

  permissionToSetAppointment(task, isAdmin) {
    return isAdmin ||
      (moment(task.day).isAfter(moment(), 'day') ||
        (moment(task.day).isSame(moment(), 'day') && moment(task.startTime, 'h:mm A').isAfter(moment().utc().subtract(2, 'hours'))));
  }

  openSpaceClickedEvent = (task, calendarName) => {
    if (!this.permissionToSetAppointment(task, this.props.isAdmin)) {
      // showPopup;
      return;
    }

    const formattedTime = moment(task.startTime).format('hh:mm A');
    let apptArgs = { day: task.day, startTime: formattedTime, calendarName };
    this.setState({
      isOpen: true,
      apptArgs
    });
  };

  onClose = () => {
    this.setState({
      isOpen: false,
      apptArgs: {}
    });
  };

  render() {
    moment.locale('en');
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
        <AppointmentModal
          args={this.state.apptArgs}
          title={this.props.title}
          onClose={this.onClose}
          onCopy={this.copyAppointment}
          onEdit={this.editAppointment}
          isOpen={this.state.isOpen}
          isCopy={this.state.apptArgs.isCopy}
          isEdit={this.state.apptArgs.isEdit}
        />
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
