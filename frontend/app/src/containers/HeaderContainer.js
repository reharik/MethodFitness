import { connect } from 'react-redux';
import { logoutUser } from './../modules/index';
import Header from './../components/layout/Header';

function mapStateToProps(state) {
  return {
    userName: state.auth.user.userName
  };
}
export default connect(mapStateToProps, { logoutUser })(Header);
