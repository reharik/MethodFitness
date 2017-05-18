import React, {Component}from 'react';
import {Notifs} from 'redux-notifications';
import {Form} from 'freakin-react-forms';
import SubmissionFor from '../../containers/forms/SubmissionForContainer';
import DisplayFor from './../formElements/elementsFor/DisplayFor';
import { syncApptTypeAndTime } from './../../utilities/appointmentTimes';

class AppointmentForm extends Component {
  containerName = 'appointmentForm';

  componentWillMount() {
    // this.props.notifClear('appointmentForm');
    const fields = Form.buildModel(this.containerName,this.props.model, {onChange: this.changeHandler});
    this.setState({fields, formIsValid: false})
  }

  onSubmitHandler = (e) => {
    e.preventDefault();
    const result = Form.prepareSubmission(this.state.fields);
    this.setState(result);
    if(result.formIsValid) {
      result.fields.trainer = result.fields.trainer.id;
      this.props.scheduleAppointment(result.fieldValues);
      this.props.cancel()
    }
    this.props.notifications(result.errors, this.containerName);
  };

  changeHandler = (e) => {
    const result = Form.onChangeHandler(this.state.fields)(e);
    this.props.notifications(result.errors, this.containerName, e.target.name);
    this.setState(result);
  };

  handleTimeChange = (e) => {
    const endTime = syncApptTypeAndTime(this.state.fields.appointmentType.value, e.target.value);
    this.state.fields.startTime.onChange(e);
    this.state.fields.endTime.value = endTime;
    this.setState({...this.state.fields});
  };

  handleAppointmentTypeChange = (e) => {
    const endTime = syncApptTypeAndTime(e.target.value, this.state.fields.startTime.value );
    this.state.fields.appointmentType.onChange(e);
    this.state.fields.endTime.value = endTime;
    this.setState({...this.state.fields});
  };

  handleClientChange = (e) => {
    if(e.target.value.length > 1 && this.state.fields.appointmentType.value !== 'pair') {
      this.state.fields.appointmentType.value = 'pair';
      this.state.fields.endTime.value = syncApptTypeAndTime(
        this.state.fields.appointmentType.value,
        this.state.fields.startTime.value
      );
    }
    if(e.target.value.length < 2 && this.state.fields.appointmentType.value === 'pair'){
      this.state.fields.appointmentType.value = 'fullHour';
    }
    this.state.fields.clients.onChange(e);
    this.setState({...this.state.fields});
  };

  render() {
    const model = this.state.fields;
    return (
      <div className='form'>
        <Notifs containerName={this.containerName}/>
        <div className="content-inner">
          <form onSubmit={this.onSubmitHandler}
                className="mf__modal__form__content" >
            <div className="form__section__row">
              {
                this.props.isAdmin
                  ? <SubmissionFor data={model.trainer} selectOptions={this.props.trainers}/>
                  : <DisplayFor data={model.trainer} selectOptions={this.props.trainers}/>
              }
            </div>
            <div className="form__section__row">
              <SubmissionFor data={model.clients} selectOptions={this.props.clients}
                             onChange={this.handleClientChange} />
            </div>
           <div className="form__section__row">
              <SubmissionFor data={model.appointmentType}
                             selectOptions={this.props.appointmentTypes}
                             onChange={this.handleAppointmentTypeChange}
              updateIfChanged={model.appointmentType.value}/>
            </div>
            <div className="form__section__row">
              <SubmissionFor data={model.date}/>
            </div>
            <div className="form__section__row">
              <SubmissionFor data={model.startTime}
                             selectOptions={this.props.times}
                             onChange={this.handleTimeChange}/>
            </div>
            <div className="form__section__row">
              <DisplayFor data={model.endTime}/>
            </div>
            <div className="form__section__row">
              <SubmissionFor data={model.notes}/>
            </div>

            <div className="mf__modal__form__footer">
              <button type="submit" className="mf__modal__form__footer__button">Save</button>
              <button type="reset" className="mf__modal__form__footer__button" onClick={this.props.cancel}>Cancel</button>
            </div>
          </form>
        </div>
      </div>);
  };
}

export default AppointmentForm;
