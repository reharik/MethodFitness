import { connect } from 'react-redux';
import { loginUser } from '../../modules/index.js';
import SignInForm from '../../components/forms/SignInForm';
import normalizeModel from './../../utilities/normalizeModel';
import { notifications } from './../../modules/notificationModule';

const mapStateToProps = state => {
  const model = normalizeModel(state.schema.definitions.signIn);
  console.log(`==========model=========`);
  console.log(model);
  console.log(`==========END model=========`);
  return {
    ajaxState: state.ajaxState,
    fields: model
  };
};

const SignInContainer = connect(mapStateToProps, { loginUser, notifications })(SignInForm);

export default SignInContainer;
