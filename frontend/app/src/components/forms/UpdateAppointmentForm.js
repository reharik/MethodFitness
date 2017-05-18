import React, {Component}from 'react';
import EditableDisplay from './../../components/forms/editableDisplay/EditableDisplay';
import AppointmentFooter from './../../components/forms/editableDisplay/AppointmentFooter';
import DisplayFor from './../formElements/elementsFor/DisplayFor';
import EditableFor from './../formElements/elementsFor/EditableFor';
import {Form} from 'freakin-react-forms';
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
      this.state.fields.startTime.onChange(e);
      this.state.fields.endTime.value = endTime;
      this.setState({...this.state.fields});
  };

  handleAppointmentTypeChange (e) {
    const endTime = syncApptTypeAndTime(e.target.value, this.state.fields.startTime.value );
    this.state.fields.appointmentType.onChange(e);
    this.state.fields.endTime.value = endTime;
    this.setState({...this.state.fields});
  };

  handleClientChange  (e) {
    if(e.target.value.length > 1 && this.state.fields.appointmentType.value !== 'pair'){
      this.state.fields.appointmentType.value = 'pair';
      this.state.fields.endTime.value =
        syncApptTypeAndTime(this.state.fields.appointmentType.value, this.state.fields.startTime.value);
    }
    if(e.target.value.length < 2 && this.state.fields.appointmentType.value === 'pair'){
      this.state.fields.appointmentType.value = 'fullHour';
    }
    this.state.fields.clients.onChange(e);
    this.setState({...this.state.fields});
  };

  submitHandler = (fields) => {
    const result = Form.prepareSubmission(fields);
    if(result.formIsValid){
      result.fields.trainer = result.fields.trainer.id;
      this.props.updateAppointment(result.fieldValues);
      this.props.cancel();
    }
    this.props.notifications(result.errors, this.containerName);

    return result;
  };

  render() {
    console.log('==========this.props.notifications=========');
    console.log(this.props.notifications);
    console.log('==========END this.props.notifications=========');
    
    return (
      <div className='form'>
        <EditableDisplay model={this.props.model}
                         submitHandler={this.submitHandler}
                         overrideSubmit={true}
                         sectionHeader="Appointment Info"
                         formName={this.containerName}
                         footer={AppointmentFooter}
                         notifications={this.props.notifications}
                         params={{copy:this.props.copy,
                         deleteAppointment:this.props.deleteAppointment,
                         appointmentId: this.props.model.id.value,
                         date: this.props.model.date.value,
                         cancel:this.props.cancel}} >
          <div className="editableDisplay__content__form__row">
            {
              this.props.isAdmin
                ? <EditableFor data="trainer" selectOptions={this.props.trainers}/>
                : <DisplayFor data="trainer" selectOptions={this.props.trainers}/>
            }
          </div>
          <div className="editableDisplay__content__form__row">
            <EditableFor data="clients" selectOptions={this.props.clients}
            bindChange={this.handleClientChange}/>
          </div>
          <div className="editableDisplay__content__form__row">
            <EditableFor data="appointmentType"
                         selectOptions={this.props.appointmentTypes}
                         bindChange={this.handleAppointmentTypeChange}/>
          </div>
          <div className="editableDisplay__content__form__row">
            <EditableFor data="date"/>
          </div>
          <div className="editableDisplay__content__form__row">
            <EditableFor data="startTime"
                         selectOptions={this.props.times}
                         bindChange={this.handleTimeChange}/>
          </div>
          <div className="editableDisplay__content__form__row">
            <DisplayFor data="endTime" />
          </div>
          <div className="editableDisplay__content__form__row">
            <EditableFor data="notes"/>
          </div>
        </EditableDisplay>
      </div>);
  };
}

export default UpdateAppointmentForm;
