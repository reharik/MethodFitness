import React from 'react';
import PropTypes from 'prop-types';
import NavigationContainer from './../../containers/MenuContainer';
import Header from './../../containers/HeaderContainer';
import SignInContainer from '../../containers/forms/SignInContainer';

const Layout = ({ isReady, isAuthenticated, children }) => {
  if (!isReady) {
    return null;
  }
  if (!isAuthenticated) {
    return <SignInContainer />;
  }
  return (
    <div className="app">
      <Header />
      <div className="mainBody">
        <NavigationContainer />
        <div className="mainContent">
          <div className="mainContent__contentInner">
            {children}
          </div>
          <div className="mainContent__contentFooter" />
        </div>
      </div>
    </div>
  );
};

Layout.propTypes = {
  isReady: PropTypes.bool,
  isAuthenticated: PropTypes.bool,
  children: PropTypes.object
};

export default Layout;
