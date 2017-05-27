import { connect } from 'react-redux';
import SubmissionFor from '../../components/formElements/elementsFor/SubmissionFor';

const mapStateToProps = (state, props) => {
  return {
    ...props
  };
};

const SubmissionForContainer = connect(mapStateToProps)(SubmissionFor);

export default SubmissionForContainer;
