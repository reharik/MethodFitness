import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { syncApptTypeAndTime } from '../../utilities/appointmentTimes';
import EditableFor from '../formElements/EditableFor';
import { Form, Card, Row, Col } from 'antd';

class UpdateAppointmentForm extends Component {
  containerName = 'updateUpdateAppointmentForm';
  state = {editing: false};

  toggleEdit = (e, rollBack) => {
    e.preventDefault();
    if (rollBack) {
      this.setState({ editing: !this.state.editing });
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
        <Card title={'Appoointment Info'} >
          <Form onSubmit={this.onSubmitHandler} layout={'vertical'} >
            <EditableFor form={form} data={model.id} hidden={true} />
            <Row type="flex">
              <EditableFor
                editing={this.state.editing}
                form={form}
                data={model.trainer}
                selectOptions={this.props.trainers} />
            </Row>
            <Row type="flex">
              <EditableFor
                editing={this.state.editing}
                form={form} data={model.clients}
                selectOptions={this.props.clients}
                onChange={this.handleClientChange} />
            </Row>
            <Row type="flex">
              <EditableFor
                editing={this.state.editing}
                form={form} data={model.appointmentType}
                selectOptions={this.props.appointmentTypes}
                onChange={this.handleAppointmentTypeChange} />
            </Row>
            <Row type="flex">
              <EditableFor
                editing={this.state.editing}
                form={form} data={model.date} />
            </Row>
            <Row type="flex">
              <EditableFor
                editing={this.state.editing}
                form={form}
                data={model.startTime}
                selectOptions={this.props.times}
                onChange={this.handleTimeChange} />
            </Row>
            <Row type="flex">
              <EditableFor
                editing={this.state.editing}
                form={form} data={model.endTime} />
            </Row>
            <Row type="flex">
              <EditableFor
                editing={this.state.editing}
                form={form} data={model.notes} />
            </Row>
            <Row type="flex" style={{margin: '24px 0'}}>
              <Col span={4}>
                <button  className="form__footer__button">
                  Copy
                </button>
              </Col>
              <Col span={4}>
                <button  className="form__footer__button" onClick={this.props.deleteAppointment}>
                  Delete
                </button>
              </Col>
              <Col span={4}>
                <button  className="form__footer__button" toggle>
                  Edit
                </button>
              </Col>
              <Col span={4}>
                <button  className="form__footer__button">
                  Cancel
                </button>
              </Col>
            </Row>
            {/*<EDFooter editing={this.state.editing} toggleEdit={this.toggleEdit} />*/}
          </Form>
        </Card>
      </div>
    );
  }
}

UpdateAppointmentForm.propTypes = {
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

export default Form.create({mapPropsToFields: (props) => ({...props.model})})(UpdateAppointmentForm);
