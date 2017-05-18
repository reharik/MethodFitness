import React from 'react';

import {Link} from 'react-router';

const UserProfileHeader = ({userName, logoutUser}) => (
    <div className="mainHeader__profile__links">
        <Link className="mainHeader__profile__links__link" to="profile">{userName}</Link>
        <a href="" className="mainHeader__profile__links__link" onClick={e => { e.preventDefault(); logoutUser()}}> Sign out </a>
    </div>
);

export default UserProfileHeader;
