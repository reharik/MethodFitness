import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SubmissionFor from './../formElements/SubmissionFor';
import { Form, Button, Row, Col } from 'antd';
import Notification from './../../containers/NotificationContainer';
import { LOGIN } from './../../modules/authModule';

class SignInForm extends Component {
  containerName = 'signIn';

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.clearNotification();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let payload = {password: values.password.trim(), userName: values.userName.trim()};
        this.props.loginUser(payload);
      }
    });
  };

  render() {
    if (!this.props.fields) {
      return null;
    }
    const model = this.props.fields;
    const form = this.props.form;

    // const { getFieldDecorator,  getFieldError, getFieldsError, isFieldTouched } = this.props.form;

    // const userNameError = isFieldTouched('userName') && getFieldError('userName');
    // const passwordError = isFieldTouched('password') && getFieldError('password');
    return (
      <div className="signIn">
        <div className="signIn__outer">
          <div className="signIn__header" />
          <div className="signIn__content">
            <Notification actionName={LOGIN.FAILURE} />
            <Form onSubmit={this.handleSubmit}>
              <Row type="flex" className="signIn__form__header">
                <Col span={24} >
                  <label className="signIn__form__header__label">Sign In</label>
                </Col>
              </Row>
              <Row type="flex" className="signIn__form__row">
                <SubmissionFor form={form} data={model.userName} span={24} />
              </Row>
              <Row type="flex" className="signIn__form__row">
                {/*<SubmissionFor data={model.password} />*/}
                <SubmissionFor form={form} data={model.password} span={24} />
              </Row>
              <Row type="flex" className="signIn__form__footer">
                <Button type="submit" htmlType="submit" className="signIn__form__footer__button">
                  Sign In
                </Button>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

SignInForm.propTypes = {
  fields: PropTypes.object,
  loginUser: PropTypes.func,
  notifications: PropTypes.string,
  form: PropTypes.object,
  clearNotification: PropTypes.func
};

export default Form.create()(SignInForm);
