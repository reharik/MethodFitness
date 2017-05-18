import {connect} from 'react-redux';
import {loginUser} from '../../modules/index.js';
import SignInForm from '../../components/forms/SignInForm';
import formJsonSchema from '../../utilities/formJsonSchema';
import { notifications } from './../../modules/notificationModule';

const mapStateToProps = (state) => {
  const model = formJsonSchema(state.schema.definitions.signIn);
  return {
    ajaxState: state.ajaxState,
    fields: model
  }
};

const SignInContainer = connect(mapStateToProps,{ loginUser, notifications })(SignInForm);

export default SignInContainer;
