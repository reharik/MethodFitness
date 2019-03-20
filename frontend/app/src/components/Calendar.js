import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ContentHeader from './ContentHeader';
import AppointmentModal from './AppointmentModal';
import { Calendar } from 'redux-task-calendar';
import ToggleTrainerListForCalendarContainer from './../containers/ToggleTrainerListContainer';
import { permissionToSetAppointment } from './../utilities/appointmentTimes';
import { Row, Col } from 'antd';
import riMoment from './../utilities/riMoment';
import Breakjs from 'breakjs';
import { Modal } from 'antd';
const warning = Modal.warning;

// eslint-disable-next-line new-cap
const _layout = Breakjs({
  mobile: 0,
  tablet: 768,
  laptop: 1201,
});

const MFCalendar = ({
  config,
  retrieveData,
  updateTaskViaDND,
  title,
  isAdmin,
  appointments,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [apptArgs, setApptArgs] = useState({});
  const [layout, setLayout] = useState(_layout.current());

  useEffect(() => {
    retrieveData();
    _layout.addChangeListener(layout => setLayout(layout)); // eslint-disable-line no-shadow
    return () => {
      _layout.removeChangeListener(layout => setLayout(layout)); // eslint-disable-line no-shadow
    };
  }, []);

  const copyAppointment = args => {
    let newApptArgs = {
      appointmentId: args.appointmentId,
      isCopy: true,
    };
    setIsOpen(true);
    setApptArgs(newApptArgs);
  };

  const editAppointment = args => {
    let newApptArgs = {
      appointmentId: args.appointmentId,
      isEdit: true,
    };
    setIsOpen(true);
    setApptArgs(newApptArgs);
  };

  const taskClickedEvent = (appointmentId, task, calendarName) => {
    let newApptArgs = {
      appointmentId,
      task,
      calendarName,
    };
    setIsOpen(true);
    setApptArgs(newApptArgs);
  };

  const openSpaceClickedEvent = (task, calendarName) => {
    if (!permissionToSetAppointment({ ...task, appointmentDate: task.day }, isAdmin)) {
      warning({
        title: `You can not set an appointment in the past`,
        okText: 'OK',
      });
      return;
    }
    const formattedTime = riMoment(task.startTime)
      .format('hh:mm A');
    let newApptArgs = {
      day: task.day,
      startTime: formattedTime,
      calendarName,
    };
    setIsOpen(true);
    setApptArgs(newApptArgs);
  };

  const onClose = () => {
    setIsOpen(false);
    setApptArgs({});
  };

  let calConfig = {
    ...config,
    retrieveData,
    updateTaskViaDND,
    taskClickedEvent,
    openSpaceClickedEvent,
  };
  if (layout === 'mobile') {
    calConfig = {
      ...config,
      defaultView: 'day',
      hideViewMenu: true,
    };
  }

  return (
    <div id="mainCalendar">
      <ContentHeader />
      <div className="form-scroll-inner">
        <div className="mainCalendar__content__inner">
          <Row
            type="flex"
            style={
              layout === 'laptop'
                ? { width: '100%' }
                : {
                    flexDirection: 'column-reverse',
                    width: '100%',
                  }
            }
          >
            {isAdmin ? (
              <Col xl={4} lg={4} sm={24}>
                <ToggleTrainerListForCalendarContainer />
              </Col>
            ) : null}
            <Col xl={20} lg={20} sm={24}>
              <Calendar config={calConfig} tasks={appointments} />
            </Col>
          </Row>
        </div>
      </div>
      <AppointmentModal
        args={apptArgs}
        title={title}
        onClose={onClose}
        onCopy={copyAppointment}
        onEdit={editAppointment}
        isOpen={isOpen}
        isCopy={apptArgs.isCopy}
        isEdit={apptArgs.isEdit}
      />
    </div>
  );
};

MFCalendar.propTypes = {
  config: PropTypes.object,
  layout: PropTypes.string,
  retrieveData: PropTypes.func,
  updateTaskViaDND: PropTypes.func,
  title: PropTypes.string,
  isAdmin: PropTypes.bool,
  appointments: PropTypes.array,
};

export default MFCalendar;
