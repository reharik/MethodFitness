import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Notifs } from 'redux-notifications';
import ContentHeader from '../ContentHeader';
import { browserHistory } from 'react-router';
import SubmissionFor from './../formElements/SubmissionFor';
import { Form, Card, Row, Col } from 'antd';

class LocationForm extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.addLocation(values);
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
                onClick={() => browserHistory.push('/location')}
              />
            </div>
            <div className="form__header__center">
              <div className="form__header__center__title">Location</div>
            </div>
            <div className="form__header__right" />
          </div>
        </ContentHeader>
        <Notifs containerName="locationForm" />
        <div className="form-scroll-inner">
          <Form
            onSubmit={this.handleSubmit}
            className="form__content"
            layout="vertical"
          >
            <Row type="flex">
              <Col xl={10} lg={14} sm={24}>
                <Card title="Location Info">
                  <Row type="flex">
                    <SubmissionFor form={form} data={model.name} />
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

LocationForm.propTypes = {
  model: PropTypes.object,
  params: PropTypes.object,
  fetchLocationAction: PropTypes.func,
  addLocation: PropTypes.func,
  notifications: PropTypes.func,
  states: PropTypes.array,
  form: PropTypes.object,
  sources: PropTypes.array,
};

export default Form.create()(LocationForm);
