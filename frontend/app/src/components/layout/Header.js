import React from 'react';

import UserProfileHeader from './UserProfileHeader';

const Header = ({userName, logoutUser}) => (
  <div className="mainHeader">
    <UserProfileHeader userName={userName} logoutUser={logoutUser}/>
  </div>
);

module.exports = Header;
