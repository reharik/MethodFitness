import { connect } from 'react-redux';
import EditableDisplay from '../../components/forms/editableDisplay/EditableDisplay';
import { actions as notifActions } from 'redux-notifications';
const { notifClear } = notifActions;

const mapStateToProps = (state, props) => {
  return {
    ...props
  };
};

export default connect(mapStateToProps, { notifClear })(EditableDisplay);
