import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const UserProfileHeader = ({ userName, logoutUser }) => {
  const logout = e => {
    e.preventDefault();
    logoutUser();
  };
  return (
    <div className="mainHeader__profile__links">
      <Link
        id="userName"
        data-id={'userName'}
        className="mainHeader__profile__links__link"
        to="profile"
      >
        {userName}
      </Link>
      <a
        href=""
        data-id={'signOut'}
        className="mainHeader__profile__links__link"
        onClick={logout}
      >
        &nbsp;Sign out&nbsp;
      </a>
    </div>
  );
};

UserProfileHeader.propTypes = {
  userName: PropTypes.string,
  logoutUser: PropTypes.func,
};

export default UserProfileHeader;
