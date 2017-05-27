import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditableDisplay from './../../components/forms/editableDisplay/EditableDisplay';
import AppointmentFooter from './../../components/forms/editableDisplay/AppointmentFooter';
import DisplayFor from './../formElements/elementsFor/DisplayFor';
import EditableFor from './../formElements/elementsFor/EditableFor';
import { Form } from 'freakin-react-forms';
import { syncApptTypeAndTime } from './../../utilities/appointmentTimes';

class UpdateAppointmentForm extends Component {
  containerName = 'ApointmentInfo';
  componentWillMount() {
    this.loadData();
  }

  loadData() {
    // this.props.notifClear('appointmentForm');
    if (this.props.apptId) {
      this.props.fetchAppointmentAction(this.props.apptId);
    }
  }

  handleTimeChange(e) {
    const endTime = syncApptTypeAndTime(this.state.fields.appointmentType.value, e.target.value);
    let fields = [...this.state.fields];
    fields.startTime.onChange(e);
    fields.endTime = {...fields.endTime, value: endTime};
    this.setState({ ...fields });
  }

  handleAppointmentTypeChange(e) {
    const endTime = syncApptTypeAndTime(e.target.value, this.state.fields.startTime.value);
    let fields = [...this.state.fields];
    fields.appointmentType.onChange(e);
    fields.endTime = {...fields.endTime, value: endTime};
    this.setState({ fields });
  }

  handleClientChange(e) {
    let fields = [...this.state.fields];
    if (e.target.value.length > 1 && this.state.fields.appointmentType.value !== 'pair') {
      fields.appointmentType = {...fields.appointmentType, value: 'pair'};
      fields.endTime = {...fields.endTime, value: syncApptTypeAndTime(
        fields.appointmentType.value,
        fields.startTime.value
      )};
    }
    if (e.target.value.length < 2 && this.state.fields.appointmentType.value === 'pair') {
      fields.appointmentType = {...fields.appointmentType, value: 'fullHour'};
    }
    fields.clients.onChange(e);
    this.setState({ ...fields });
  }

  submitHandler = fields => {
    const result = Form.prepareSubmission(fields);
    if (result.formIsValid) {
      result.fields.trainer = result.fields.trainer.id;
      this.props.updateAppointment(result.fieldValues);
      this.props.cancel();
    }
    this.props.notifications(result.errors, this.containerName);

    return result;
  };

  render() {
    return (
      <div className="form">
        <EditableDisplay
          model={this.props.model}
          submitHandler={this.submitHandler}
          overrideSubmit={true}
          sectionHeader="Appointment Info"
          formName={this.containerName}
          footer={AppointmentFooter}
          notifications={this.props.notifications}
          params={{
            copy: this.props.copy,
            deleteAppointment: this.props.deleteAppointment,
            appointmentId: this.props.model.id.value,
            date: this.props.model.date.value,
            cancel: this.props.cancel
          }}
        >
          <div className="editableDisplay__content__form__row">
            {this.props.isAdmin
              ? <EditableFor data="trainer" selectOptions={this.props.trainers} />
              : <DisplayFor data="trainer" selectOptions={this.props.trainers} />}
          </div>
          <div className="editableDisplay__content__form__row">
            <EditableFor data="clients" selectOptions={this.props.clients} bindChange={this.handleClientChange} />
          </div>
          <div className="editableDisplay__content__form__row">
            <EditableFor
              data="appointmentType"
              selectOptions={this.props.appointmentTypes}
              bindChange={this.handleAppointmentTypeChange}
            />
          </div>
          <div className="editableDisplay__content__form__row">
            <EditableFor data="date" />
          </div>
          <div className="editableDisplay__content__form__row">
            <EditableFor data="startTime" selectOptions={this.props.times} bindChange={this.handleTimeChange} />
          </div>
          <div className="editableDisplay__content__form__row">
            <DisplayFor data="endTime" />
          </div>
          <div className="editableDisplay__content__form__row">
            <EditableFor data="notes" />
          </div>
        </EditableDisplay>
      </div>
    );
  }
}

UpdateAppointmentForm.propTypes = {
  apptId: PropTypes.string,
  notifications: PropTypes.func,
  model: PropTypes.object,
  isAdmin: PropTypes.bool,
  trainers: PropTypes.array,
  clients: PropTypes.array,
  appointmentTypes: PropTypes.array,
  times: PropTypes.array,
  fetchAppointmentAction: PropTypes.func,
  updateAppointment: PropTypes.func,
  cancel: PropTypes.func,
  copy: PropTypes.func,
  deleteAppointment: PropTypes.func
};

export default UpdateAppointmentForm;
