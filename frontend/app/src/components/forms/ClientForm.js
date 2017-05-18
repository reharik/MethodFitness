import React, {Component} from 'react';
import {Notifs} from 'redux-notifications';
import {Form} from 'freakin-react-forms';
import ContentHeader from '../ContentHeader';
import SubmissionFor from '../../containers/forms/SubmissionForContainer';
import {browserHistory} from 'react-router';

class ClientForm extends Component {
  componentWillMount() {
    this.loadData();
    const fields = Form.buildModel('clientForm', this.props.model, {onChange: this.changeHandler})
    this.setState({fields, formIsValid: false})
  }

  loadData() {
    if (this.props.params.clientId) {
      this.props.fetchClientAction(this.props.params.clientId);
    }
  }

  onSubmitHandler = (e) => {
    e.preventDefault();
    const result = Form.prepareSubmission(this.state.fields);
    if(result.formIsValid){
      this.props.addClient(result.fieldValues);
    }
    this.props.notifications(result.errors, this.containerName);
    this.setState(result);
  };

  changeHandler = (e) => {
    const result = Form.onChangeHandler(this.state.fields)(e);
    this.props.notifications(result.errors, this.containerName, e.target.name);
    this.setState(result);
  };

  formReset = () => {
    const fields = Form.buildModel('clientForm', this.props.model, {onChange: this.changeHandler});
    this.setState({fields, formIsValid: false})
  };

  render() {
    const model = this.state.fields;
    return (
      <div className='form'>
        <ContentHeader >
          <div className="form__header">
            <div className="form__header__left">

              <button className="contentHeader__button__new" title="New"
                      onClick={() => browserHistory.push('/client')}/>
            </div>
            <div className="form__header__center">
              <div className="form__header__center__title">Client</div>
            </div>
            <div className="form__header__right">
            </div>
          </div>
        </ContentHeader>
        <Notifs containerName="clientForm"/>
        <div className="form-scroll-inner">
          <div className="content-inner">
            <form onSubmit={this.onSubmitHandler} className="form__content">
              <div className="form__section__header">
                <label className="form__section__header__label">Client Info</label>
              </div>
              <div className="form__section__row">
                <SubmissionFor data={model.firstName}/>
                <SubmissionFor data={model.lastName}/>
              </div>
              <div className="form__section__header">
                <label className="form__section__header__label">Contact Info</label>
              </div>
              <div className="form__section__row">
                <SubmissionFor data={model.mobilePhone}/>
                <SubmissionFor data={model.secondaryPhone}/>
              </div>
              <div className="form__section__row">
                <SubmissionFor data={model.email}/>
                <SubmissionFor data={model.birthDate}/>
              </div>
              <div className="form__section__row">
                <SubmissionFor data={model.street1}/>
                <SubmissionFor data={model.street2}/>
              </div>
              <div className="form__section__row">
                <SubmissionFor data={model.city} containerStyle="form__section__row__address__city"/>
                <SubmissionFor selectOptions={this.props.states}
                               data={model.state}
                               containerStyle="form__section__row__address__state"
                />
                <SubmissionFor data={model.zipCode} containerStyle="form__section__row__address__zip"/>
              </div>
                <div className="form__section__header">
                  <label className="form__section__header__label">Source Info</label>
                </div>
                <div className="form__section__row">
                  <SubmissionFor data={model.source} selectOptions={this.props.sources}/>
                  <SubmissionFor data={model.startDate}/>
                </div>
                <div className="form__section__row">
                  <SubmissionFor data={model.sourceNotes}/>
                </div>

              <div className="form__footer">
                <button type="submit" className="form__footer__button">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>);
  };
}

export default ClientForm;
