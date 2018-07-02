import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Notifs } from 'redux-notifications';
import ContentHeader from '../ContentHeader';
import { browserHistory } from 'react-router';
import SubmissionFor from './../formElements/SubmissionFor';
import { Form, Card, Row, Col } from 'antd';

class ClientForm extends Component {
  handleSubmit = e => {
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
          <Form
            onSubmit={this.handleSubmit}
            className="form__content"
            layout="vertical"
          >
            <Row type="flex">
              <Col xl={10} lg={14} sm={24}>
                <Card title="Client Info">
                  <Row type="flex">
                    <SubmissionFor form={form} data={model.firstName} />
                    <SubmissionFor form={form} data={model.lastName} />
                  </Row>
                </Card>
              </Col>
            </Row>
            <Row type="flex">
              <Col xl={10} lg={14} sm={24}>
                <Card title="Contact Info">
                  <Row type="flex">
                    <SubmissionFor form={form} data={model.mobilePhone} />
                    <SubmissionFor form={form} data={model.secondaryPhone} />
                  </Row>
                  <Row type="flex">
                    <SubmissionFor form={form} data={model.email} />
                    <SubmissionFor form={form} data={model.birthDate} />
                  </Row>
                  <Row type="flex">
                    <SubmissionFor form={form} data={model.street1} />
                    <SubmissionFor form={form} data={model.street2} />
                  </Row>
                  <Row type="flex">
                    <SubmissionFor form={form} data={model.city} />
                    <SubmissionFor
                      span={8}
                      form={form}
                      selectOptions={this.props.states}
                      data={model.state}
                    />
                    <SubmissionFor form={form} data={model.zipCode} span={4} />
                  </Row>
                </Card>
              </Col>
            </Row>
            <Row type="flex">
              <Col xl={10} lg={14} sm={24}>
                <Card title="Source Info">
                  <Row type="flex">
                    <SubmissionFor
                      form={form}
                      data={model.source}
                      selectOptions={this.props.sources}
                    />
                    <SubmissionFor form={form} data={model.startDate} />
                  </Row>
                  <Row type="flex">
                    <SubmissionFor
                      form={form}
                      data={model.sourceNotes}
                      span={24}
                    />
                  </Row>
                </Card>
              </Col>
            </Row>
            <Row type="flex" style={{ margin: '24px 0' }}>
              <Col span={4}>
                <button type="submit" className="form__footer__button">
                  Submit
                </button>
              </Col>
            </Row>
          </Form>
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
  sources: PropTypes.array,
};

export default Form.create()(ClientForm);
