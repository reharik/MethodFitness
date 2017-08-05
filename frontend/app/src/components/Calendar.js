import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentHeader from './ContentHeader';
import AppointmentModal from './AppointmentModal';
import { Calendar } from 'redux-task-calendar';
import ToggleTrainerListForCalendarContainer from './../containers/ToggleTrainerListContainer';
import { Row, Col } from 'antd';
import moment from 'moment';
import Breakjs from 'breakjs';

const layout = Breakjs({
  mobile: 0,
  tablet: 768,
  laptop: 1201
});

class MFCalendar extends Component {
  state = {
    isOpen: false,
    apptArgs: {},
    layout: layout.current()
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
    if(this.state.layout === 'mobile') {
      this.config = {
        ...this.props.config,
        defaultView: 'day',
        hideViewMenu: true
      };
    }
    layout.addChangeListener(layout => this.setState({layout}));
  }

  componentWillUnmount() {
    layout.removeChangeListener(layout => this.setState({layout}));
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
    let apptArgs = {apptId: id, task, calendarName};
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
    let apptArgs = {day: task.day, startTime: formattedTime, calendarName};
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
        <ContentHeader />
        <div className="form-scroll-inner">
          <div className="mainCalendar__content__inner">
            <Row type="flex" style={this.state.layout === 'laptop'
              ? {width: '100%'}
              : { flexDirection: 'column-reverse', width: '100%' }}>
              {this.props.isAdmin ? <Col xl={3} lg={4} sm={24}><ToggleTrainerListForCalendarContainer /></Col> : null}
              <Col xl={21} lg={20} sm={24} >
                <Calendar config={this.config} />
              </Col>
            </Row>
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
  layout: PropTypes.string,
  fetchClientsAction: PropTypes.func,
  fetchTrainersAction: PropTypes.func,
  retrieveDataAction: PropTypes.func,
  updateTaskViaDND: PropTypes.func,
  title: PropTypes.string,
  isAdmin: PropTypes.bool
};

export default MFCalendar;
