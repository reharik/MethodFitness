import React from 'react';
import PropTypes from 'prop-types';

import UserProfileHeader from './UserProfileHeader';

const Header = ({ userName, logoutUser }) => (
  <div className="mainHeader">
    <UserProfileHeader userName={userName} logoutUser={logoutUser} />
  </div>
);

Header.propTypes = {
  userName: PropTypes.string,
  logoutUser: PropTypes.func
};

export default Header;
