import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Notifs } from 'redux-notifications';
import DisplayFor from './../formElements/DisplayFor';
import { syncApptTypeAndTime } from './../../utilities/appointmentTimes';
import SubmissionFor from './../formElements/SubmissionFor';
import { Form, Card, Row, Col } from 'antd';

class AppointmentForm extends Component {
  containerName = 'appointmentForm';

  componentWillMount() {
    // this.props.notifClear('appointmentForm');
    // const fields = Form.buildModel(this.containerName, this.props.model, {onChange: this.changeHandler});
    // this.setState({fields, formIsValid: false});
  }

  onSubmitHandler = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.scheduleAppointment(values);
        this.props.cancel();
        console.log('Received values of form: ', values);
      }
    });
  };

  changeHandler = e => {
    const result = Form.onChangeHandler(this.state.fields)(e);
    this.props.notifications(result.errors, this.containerName, e.target.name);
    this.setState(result);
  };

  handleTimeChange = value => {
    const endTime = syncApptTypeAndTime(this.props.form.getFieldValue('appointmentType'), value);
    this.props.form.setFieldsValue({endTime});
  };

  handleAppointmentTypeChange = value => {
    if (this.props.form.getFieldValue('clients').length > 1 && value !== 'pair'){
      this.props.form.setFieldsValue({clients:[]});
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

  render() {
    const model = this.props.model;
    const form = this.props.form;
    return (
      <div className="form">
        <Notifs containerName={this.containerNamelayout={'vertical'}
        <Form onSubmit={this.onSubmitHandler} className="mf__modal__form__content">
          <Row type="flex">
            {this.props.isAdmin
              ? <SubmissionFor  form={form} data={model.trainer} selectOptions={this.props.trainerslayout={'vertical'}
              : <DisplayFor data={model.trainer} selectOptions={this.props.trainerslayout={'vertical'}}
          </Row>
          <Row type="flex">
            <SubmissionFor
              form={form} data={model.clients}
              selectOptions={this.props.clients}
              onChange={this.handleClientChange}
            />
          </Row>
          <Row type="flex">
            <SubmissionFor
              form={form} data={model.appointmentType}
              selectOptions={this.props.appointmentTypes}
              onChange={this.handleAppointmentTypeChange}
              updateIfChanged={model.appointmentType.value}
            />
          </Row>
          <Row type="flex">
            <SubmissionFor form={form} data={model.datelayout={'vertical'}
          </Row>
          <Row type="flex">
            <SubmissionFor form={form} data={model.startTime} selectOptions={this.props.times} onChange={this.handleTimeChangelayout={'vertical'}
          </Row>
          <Row type="flex">
            <SubmissionFor form={form} data={model.endTime} />
          </Row>
          <Row type="flex">
            <SubmissionFor form={form} data={model.noteslayout={'vertical'}
          </Row>
          <Row type="flex" style={{margin: '24px 0'}}>
            <Col span={4}>
              <button type="submit">Save</button>
              <button type="reset" onClick={this.props.cancel}>Cancel</button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

AppointmentForm.propTypes = {
  model: PropTypes.object,
  scheduleAppointment: PropTypes.func,
  cancel: PropTypes.func,
  notifications: PropTypes.func,
  isAdmin: PropTypes.bool,
  trainers: PropTypes.array,
  clients: PropTypes.array,
  appointmentTypes: PropTypes.array,
  times: PropTypes.array
};

export default Form.create({mapPropsToFields: (props) => ({...props.model})})(AppointmentForm);
