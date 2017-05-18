import React from 'react';
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

export default Layout;
