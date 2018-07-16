import { connect } from 'react-redux';
import Notification from './../components/Notification';

const mapStateToProps = function mapStateToProps(state, props) {
  return {
    notification: state.notifications[props.actionName],
  };
};

export default connect(mapStateToProps)(Notification);
