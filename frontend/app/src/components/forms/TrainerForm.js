import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Notifs } from 'redux-notifications';
import ContentHeader from '../ContentHeader';
import SubmissionFor from './../formElements/SubmissionFor';
import { browserHistory } from 'react-router';
import AjaxState from './../../containers/AjaxStateContainer';
import { Form, Card, Row, Col } from 'antd';

class TrainerForm extends Component {
  componentWillMount() {
    this.loadData();
  }

  loadData() {
    if (this.props.params.trainerId) {
      this.props.fetchTrainerAction(this.props.params.trainerId);
    }
    this.props.fetchClientsAction();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.hireTrainer(values);
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const model = this.props.model;
    const form = this.props.form;

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
            <div className="form__header__right"/>
          </div>
        </ContentHeader>
        <Notifs containerName="trainerForm"/>
        <div className="form-scroll-inner">
          <Form onSubmit={this.handleSubmit} className="form__content" layout="vertical">
            <Row type="flex">
              <Col span={8}>
                <Card title="Contact Info">
                  <Row type="flex">
                    <SubmissionFor form={form} data={model.firstNamelayout={'vertical'}
                    <SubmissionFor form={form} data={model.lastNamelayout={'vertical'}
                  </Row>
                  <Row type="flex">
                    <SubmissionFor form={form} data={model.mobilePhonelayout={'vertical'}
                    <SubmissionFor form={form} data={model.secondaryPhonelayout={'vertical'}
                  </Row>
                  <Row type="flex">
                    <SubmissionFor form={form} data={model.emaillayout={'vertical'}
                  </Row>
                  <Row type="flex">
                    <SubmissionFor form={form} data={model.street1layout={'vertical'}
                    <SubmissionFor form={form} data={model.street2layout={'vertical'}
                  </Row>
                  <Row type="flex">
                    <SubmissionFor form={form} data={model.citylayout={'vertical'}
                    <SubmissionFor
                      selectOptions={this.props.states}
                      form={form} data={model.state}
                      span={8}
                    />
                    <SubmissionFor form={form} data={model.zipCode} span={4layout={'vertical'}
                  </Row>
                </Card>
              </Col>
            </Row>
            <Row type="flex">
              <Col span={8}>
                <Card title="Trainer Info">
                  <Row type="flex">
                    <SubmissionFor form={form} data={model.birthDatelayout={'vertical'}
                    {/*<SubmissionFor form={form} data={model.defaultClientRate} />*/}
                    <SubmissionFor form={form} data={model.colorlayout={'vertical'}
                  </Row>
                </Card>
              </Col>
            </Row>
            <Row type="flex">
              <Col span={8}>
                <Card title="Trainer Credentials">
                  <Row type="flex"> <SubmissionFor form={form} data={model.passwordlayout={'vertical'}
                  </Row>
                  <Row type="flex">
                    <SubmissionFor form={form} data={model.confirmPasswordlayout={'vertical'}
                  </Row>
                  <Row type="flex">
                    <SubmissionFor selectOptions={this.props.roles} form={form} data={model.rolelayout={'vertical'}
                  </Row>
                </Card>
              </Col>
            </Row>
            <Row type="flex">
              <Col span={8}>
                <Card title="Trainer' Clients">
                  <Row type="flex">
                    <SubmissionFor selectOptions={this.props.clients} form={form} data={model.clients}/>
                  </Row>
                </Card>
              </Col>
            </Row>
            <Row type="flex">
              <div className="form__footer">
                <button type="submit" className="form__footer__button">
                  Submit
                </button>
                <button type="reset" onClick={this.formReset} className="form__footer__button">
                  Cancel
                </button>
              </div>
            </Row>
          </Form>
        </div>
      </div>);
  };
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

export default Form.create()(TrainerForm);
