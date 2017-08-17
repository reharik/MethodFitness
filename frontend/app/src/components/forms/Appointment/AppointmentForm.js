import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { syncApptTypeAndTime, getISODateTime } from '../../../utilities/appointmentTimes';
import DisplayFor from '../../formElements/DisplayFor';
import HiddenFor from '../../formElements/HiddenFor';
import EditableFor from '../../formElements/EditableFor';
import { Form, Card, Row } from 'antd';
import AppointmentFooter from './AppointmentFooter';
import moment from 'moment';

class AppointmentForm extends Component {
  containerName = 'appointmentForm';
  state = {editing: this.props.editing};

  componentWillReceiveProps(newProps) {
    this.setState({editing: newProps.editing});
  }

  toggleEdit = (e, rollBack) => {
    e.preventDefault();
    if (rollBack) {
      this.setState({editing: !this.state.editing});
    } else {
      this.setState({
        editing: !this.state.editing
      });
    }
  };

  onSubmitHandler = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.color = this.props.trainers.find(x => x.value === values.trainerId).color;
        if(!values.trainerId) {
          values.trainerId = this.props.trainerId;
        }
        if (values.id) {
          this.props.updateAppointment(values);
        } else {
          this.props.scheduleAppointment(values);
        }
        this.props.onCancel();
        console.log('Received values of form: ', values);
      }
    });
  };

  handleTimeChange = value => {
    const endTime = syncApptTypeAndTime(this.props.form.getFieldValue('appointmentType'), value);
    this.props.form.setFieldsValue({endTime});
  };

  handleAppointmentTypeChange = value => {
    if (this.props.form.getFieldValue('clients').length > 1 && value !== 'pair') {
      this.props.form.setFieldsValue({clients: []});
    }
    const endTime = syncApptTypeAndTime(value, this.props.form.getFieldValue('startTime'));
    this.props.form.setFieldsValue({endTime});
  };

  handleClientChange = value => {
    if (value.length > 1 && this.props.form.getFieldValue('appointmentType') !== 'pair') {

      this.props.form.setFieldsValue({appointmentType: 'pair'});
      const endTime = syncApptTypeAndTime('pair', this.props.form.getFieldValue('startTime'));
      this.props.form.setFieldsValue({endTime});
    }

    if (value.length < 2 && this.props.form.getFieldValue('appointmentType') === 'pair') {
      this.props.form.setFieldsValue({appointmentType: 'fullHour'});
    }
  };

  deleteHandler = () => {
    const id = this.props.form.getFieldValue('id');
    const date = this.props.form.getFieldValue('date');
    const startTime = this.props.form.getFieldValue('startTime');
    const clients = this.props.form.getFieldValue('clients');
    if (moment(getISODateTime(date, startTime)).local().isBefore(moment().local())) {
      this.props.deleteAppointmentFromPast(id, date, clients);
    } else {
      this.props.deleteAppointment(id, date);
    }
    this.props.onCancel();
  };

  copyHandler = () => {
    const apptId = this.props.form.getFieldValue('id');
    this.props.onCopy({apptId});
  };

  editHandler = () => {
    const apptId = this.props.form.getFieldValue('id');
    this.props.onEdit({apptId});
  };

  render() {
    const formItemLayout = {
      labelCol: {span: 8},
      wrapperCol: {span: 16}
    };
    const model = this.props.model;
    const form = this.props.form;
    return (
      <Card title={this.props.title}>
        <Form onSubmit={this.onSubmitHandler} layout="horizontal">
          <Row type="flex">
            <HiddenFor form={form} data={model.id} />
          </Row>
          <Row type="flex">
            {this.props.isAdmin
              ? <EditableFor
                editing={this.state.editing}
                form={form}
                data={model.trainerId}
                selectOptions={this.props.trainers}
                formItemLayout={formItemLayout}
                span={24} />
              : <DisplayFor data={model.trainerId} selectOptions={this.props.trainers} />}
          </Row>
          <Row type="flex">
            <EditableFor
              editing={this.state.editing}
              form={form} data={model.clients}
              selectOptions={this.props.clients}
              onChange={this.handleClientChange}
              formItemLayout={formItemLayout}
              span={24}
            />
          </Row>
          <Row type="flex">
            <EditableFor
              editing={this.state.editing}
              form={form} data={model.appointmentType}
              selectOptions={this.props.appointmentTypes}
              onChange={this.handleAppointmentTypeChange}
              updateIfChanged={model.appointmentType.value}
              formItemLayout={formItemLayout}
              span={24}
            />
          </Row>
          <Row type="flex">
            <EditableFor
              editing={this.state.editing}
              form={form}
              data={model.date}
              formItemLayout={formItemLayout}
              span={24} />
          </Row>
          <Row type="flex">
            <EditableFor
              editing={this.state.editing}
              form={form}
              data={model.startTime}
              selectOptions={this.props.times}
              onChange={this.handleTimeChange}
              formItemLayout={formItemLayout}
              span={24} />
          </Row>
          <Row type="flex">
            <EditableFor
              editing={this.state.editing}
              form={form}
              data={model.endTime}
              formItemLayout={formItemLayout}
              span={24} />
          </Row>
          <Row type="flex">
            <EditableFor
              editing={this.state.editing}
              form={form}
              data={model.notes}
              formItemLayout={formItemLayout}
              span={24} />
          </Row>
          <Row type="flex" style={{margin: '24px 0'}}>
            <AppointmentFooter
              buttons={this.props.buttons}
              cancelHandler={this.props.onCancel}
              deleteHandler={this.deleteHandler}
              editHandler={this.editHandler}
              copyHandler={this.copyHandler} />
          </Row>
        </Form>
      </Card>
    );
  }
}

AppointmentForm.propTypes = {
  model: PropTypes.object,
  form: PropTypes.object,
  scheduleAppointment: PropTypes.func,
  updateAppointment: PropTypes.func,
  deleteAppointment: PropTypes.func,
  onCancel: PropTypes.func,
  onCopy: PropTypes.func,
  onEdit: PropTypes.func,
  editing: PropTypes.bool,
  isAdmin: PropTypes.bool,
  title: PropTypes.string,
  trainers: PropTypes.array,
  trainerId: PropTypes.string,
  clients: PropTypes.array,
  appointmentTypes: PropTypes.array,
  times: PropTypes.array,
  buttons: PropTypes.array,
  deleteAppointmentFromPast: PropTypes.func
};

export default Form.create({mapPropsToFields: (props) => ({...props.model})})(AppointmentForm);
