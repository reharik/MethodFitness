import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Notifs } from 'redux-notifications';
import ContentHeader from '../ContentHeader';
import { browserHistory } from 'react-router';
import SubmissionFor from './../formElements/SubmissionFor';
import { Form } from 'antd';

class ClientForm extends Component {

  componentWillMount() {
    this.loadData();
  }

  loadData() {
    if (this.props.params.clientId) {
      this.props.fetchClientAction(this.props.params.clientId);
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.addClient(values);
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const model = this.props.model;
    const form = this.props.form;

    return (
      <div className="form">
        <ContentHeader>
          <div className="form__header">
            <div className="form__header__left">
              <button
                className="contentHeader__button__new"
                title="New"
                onClick={() => browserHistory.push('/client')}
              />
            </div>
            <div className="form__header__center">
              <div className="form__header__center__title">Client</div>
            </div>
            <div className="form__header__right" />
          </div>
        </ContentHeader>
        <Notifs containerName="clientForm" />
        <div className="form-scroll-inner">
          <div className="content-inner">
            <Form onSubmit={this.handleSubmit} className="form__content">
              <div className="form__section__header">
                <label className="form__section__header__label">Client Info</label>
              </div>
              <div className="form__section__row">
                <SubmissionFor form={form} data={model.firstName} />
                <SubmissionFor form={form} data={model.lastName} />
              </div>
              <div className="form__section__header">
                <label className="form__section__header__label">Contact Info</label>
              </div>
              <div className="form__section__row">
                <SubmissionFor form={form} data={model.mobilePhone} />
                <SubmissionFor form={form} data={model.secondaryPhone} />
              </div>
              <div className="form__section__row">
                <SubmissionFor form={form} data={model.email} />
                <SubmissionFor form={form} data={model.birthDate} />
              </div>
              <div className="form__section__row">
                <SubmissionFor form={form} data={model.street1} />
                <SubmissionFor form={form} data={model.street2} />
              </div>
              <div className="form__section__row">
                <SubmissionFor form={form} data={model.city} containerStyle="form__section__row__address__city" />
                <SubmissionFor
                  form={form}
                  selectOptions={this.props.states}
                  data={model.state}
                  containerStyle="form__section__row__address__state"
                />
                <SubmissionFor form={form} data={model.zipCode} containerStyle="form__section__row__address__zip" />
              </div>
              <div className="form__section__header">
                <label className="form__section__header__label">Source Info</label>
              </div>
              <div className="form__section__row">
                <SubmissionFor form={form} data={model.source} selectOptions={this.props.sources} />
                <SubmissionFor form={form} data={model.startDate} />
              </div>
              <div className="form__section__row">
                <SubmissionFor form={form} data={model.sourceNotes} />
              </div>

              <div className="form__footer">
                <button type="submit" className="form__footer__button">
                  Submit
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

ClientForm.propTypes = {
  model: PropTypes.object,
  params: PropTypes.object,
  fetchClientAction: PropTypes.func,
  addClient: PropTypes.func,
  notifications: PropTypes.func,
  states: PropTypes.array,
  form: PropTypes.object,
  sources: PropTypes.array
};

export default Form.create()(ClientForm);
