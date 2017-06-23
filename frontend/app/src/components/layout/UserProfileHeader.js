import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

const UserProfileHeader = ({ userName, logoutUser }) => {
  const logout = (e) => {
    e.preventDefault();
    logoutUser();
  };
  return (
    <div className="mainHeader__profile__links">
      <Link className="mainHeader__profile__links__link" to="profile">{userName}</Link>
      <a href="" className="mainHeader__profile__links__link" onClick={logout} >
        {' '}Sign out{' '}
      </a>
    </div>
  );
};

UserProfileHeader.propTypes = {
  userName: PropTypes.string,
  logoutUser: PropTypes.func
};

export default UserProfileHeader;
