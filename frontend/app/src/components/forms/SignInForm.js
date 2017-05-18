import React, { Component } from 'react';
import SubmissionFor from '../../containers/forms/SubmissionForContainer';
import { Notifs } from 'redux-notifications';
import { Form } from 'freakin-react-forms';
import AjaxState from './../../containers/AjaxStateContainer';
import { LOGIN } from '../../modules/authModule';

class SignInForm extends Component {
  containerName = 'signIn';

  componentWillMount() {
    const fields = Form.buildModel(this.containerName, this.props.fields, { onChange: this.changeHandler });
    this.setState({ fields, formIsValid: false });
  }

  componentDidMount() {
    this.state.fields.userName.ref.focus();
  }
  // componentWillReceiveProps(newProps) {
  //   const result = handleNewState(this.props.ajaxState, newProps.ajaxState, LOGIN, this.state.fields, "signIn");
  //   if(result.update){
  //     this.setState({ajaxState: result.ajaxState, fields: result.fields});
  //   }
  // }

  onSubmitHandler = e => {
    e.preventDefault();
    const result = Form.prepareSubmission(this.state.fields);
    if (result.formIsValid) {
      this.props.loginUser(result.fieldValues);
    }
    this.props.notifications(result.errors, this.containerName);
    this.setState(result);
  };

  changeHandler = e => {
    e.preventDefault();
    const result = Form.onChangeHandler(this.state.fields)(e);
    this.props.notifications(result.errors, this.containerName, e.target.name);
    this.setState(result);
  };

  render() {
    const model = this.state.fields;
    if (!model) {
      return null;
    }
    return (
      <div className="signIn">
        <AjaxState prefix={LOGIN.PREFIX} />
        <div className="signIn__outer">
          <div className="signIn__header" />
          <div className="signIn__content">
            <Notifs containerName="signIn" />
            <form onSubmit={this.onSubmitHandler}>
              <div className="signIn__form__header">
                <label className="signIn__form__header__label">Sign In</label>
              </div>
              <div className="signIn__form__row">
                <SubmissionFor ref="subForUserName" data={model.userName} />
              </div>
              <div className="signIn__form__row">
                <SubmissionFor data={model.password} />
              </div>
              <div className="signIn__form__footer">
                <button type="submit" className="signIn__form__footer__button">
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default SignInForm;
