import { connect } from 'react-redux';
import { loginUser } from '../../modules/index.js';
import SignInForm from '../../components/forms/SignInForm';
import normalizeModel from './../../utilities/normalizeModel';
import { clearNotification } from './../../modules/notificationModule';

const mapStateToProps = state => {
  const model = normalizeModel(state.schema.definitions.signIn);
  return {
    fields: model,
  };
};

const SignInContainer = connect(
  mapStateToProps,
  { loginUser, clearNotification },
)(SignInForm);

export default SignInContainer;
