import { connect } from 'react-redux';
import Notification from './../components/Notification';

const mapStateToProps = function(state, props) {
  return {
    notification: state.notifications[props.actionName],
  };
};

export default connect(mapStateToProps)(Notification);
