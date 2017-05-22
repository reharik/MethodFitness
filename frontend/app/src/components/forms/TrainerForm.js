import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Notifs } from 'redux-notifications';
import { Form } from 'freakin-react-forms';
import ContentHeader from '../ContentHeader';
import SubmissionFor from '../../containers/forms/SubmissionForContainer';
import { browserHistory } from 'react-router';
import AjaxState from './../../containers/AjaxStateContainer';

class TrainerForm extends Component {
  componentWillMount() {
    this.loadData();
    const fields = Form.buildModel('trainerForm', this.props.model, { onChange: this.changeHandler });
    this.setState({ fields, formIsValid: false });
  }

  loadData() {
    if (this.props.params.trainerId) {
      this.props.fetchTrainerAction(this.props.params.trainerId);
    }
    this.props.fetchClientsAction();
  }

  onSubmitHandler = e => {
    e.preventDefault();
    const result = Form.prepareSubmission(this.state.fields);
    if (result.formIsValid) {
      this.props.hireTrainer(result.fieldValues);
    }
    this.props.notifications(result.errors, this.containerName);
    this.setState(result);
  };

  changeHandler = e => {
    const result = Form.onChangeHandler(this.state.fields)(e);
    this.props.notifications(result.errors, this.containerName, e.target.name);
    this.setState(result);
  };

  formReset = () => {
    const fields = Form.buildModel('trainerForm', this.props.model, { onChange: this.changeHandler });
    this.props.notifications([], this.containerName);
    this.setState({ fields, formIsValid: false });
  };

  render() {
    const model = this.state.fields;
    return (
      <div className="form">
        <AjaxState />
        <ContentHeader>
          <div className="form__header">
            <div className="form__header__left">

              <button
                className="contentHeader__button__new"
                title="New"
                onClick={() => {
                  this.formReset();
                  browserHistory.push('/trainer');
                }}
              />
            </div>
            <div className="form__header__center">
              <div className="form__header__center__title">Trainer</div>
            </div>
            <div className="form__header__right" />
          </div>
        </ContentHeader>
        <Notifs containerName="trainerForm" />
        <div className="form-scroll-inner">
          <div className="content-inner">
            <form onSubmit={this.onSubmitHandler} className="form__content">
              <div>
                <div className="form__section__header">
                  <label className="form__section__header__label">Contact Info</label>
                </div>
                <div className="form__section__row">
                  <SubmissionFor data={model.firstName} />
                  <SubmissionFor data={model.lastName} />
                </div>
                <div className="form__section__row">
                  <SubmissionFor data={model.mobilePhone} />
                  <SubmissionFor data={model.secondaryPhone} />
                </div>
                <div className="form__section__row__single">
                  <SubmissionFor data={model.email} />
                </div>
                <div className="form__section__row">
                  <SubmissionFor data={model.street1} />
                  <SubmissionFor data={model.street2} />
                </div>
                <div className="form__section__row">
                  <SubmissionFor data={model.city} containerStyle="form__section__row__address__city" />
                  <SubmissionFor
                    selectOptions={this.props.states}
                    data={model.state}
                    containerStyle="form__section__row__address__state"
                  />
                  <SubmissionFor data={model.zipCode} containerStyle="form__section__row__address__zip" />
                </div>
                <div className="form__section__header">
                  <label className="form__section__header__label">Trainer Info</label>
                </div>
                <div className="form__section__row">
                  <SubmissionFor data={model.birthDate} />
                  {/*<SubmissionFor data={model.defaultClientRate} /> */}
                  <SubmissionFor data={model.color} />
                </div>
                <div className="form__section__header">
                  <label className="form__section__header__label">Trainer Credentials</label>
                </div>
                <div className="form__section__row">
                  <SubmissionFor data={model.password} />
                </div>
                <div className="form__section__row">
                  <SubmissionFor data={model.confirmPassword} />
                </div>
                <div className="form__section__row">
                  <SubmissionFor selectOptions={this.props.roles} data={model.role} />
                </div>
                <div className="form__section__header">
                  <label className="form__section__header__label">Trainer's Clients</label>
                </div>
                <div className="form__section__row">
                  <SubmissionFor selectOptions={this.props.clients} data={model.clients} />
                </div>
              </div>
              <div className="form__footer">
                <button type="submit" className="form__footer__button">
                  Submit
                </button>
                <button type="reset" onClick={this.formReset} className="form__footer__button">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

TrainerForm.propTypes = {
  params: PropTypes.object,
  notifications: PropTypes.func,
  model: PropTypes.object,
  fetchTrainerAction: PropTypes.func,
  fetchClientsAction: PropTypes.func,
  hireTrainer: PropTypes.func,
  states: PropTypes.array,
  roles: PropTypes.array,
  clients: PropTypes.array
};

export default TrainerForm;
