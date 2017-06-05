import React from 'react';
import PropTypes from 'prop-types';
import NavigationContainer from './../../containers/MenuContainer';
import Header from './../../containers/HeaderContainer';
import SignInContainer from '../../containers/forms/SignInContainer';
import {Layout} from 'antd';
const { Content, Sider} = Layout;

const _Layout = ({isReady, isAuthenticated, children}) => {
  if (!isReady) {
    return null;
  }
  if (!isAuthenticated) {
    return <SignInContainer />;
  }
  return (
    <Layout >
      <Header />
      <Layout>
        <Sider width={220} style={{background: '#f2f2f2'}}>
          <NavigationContainer />
        </Sider>
        <Layout style={{padding: '0 0 24px', background: '#f2f2f2'}}>
          <Content style={{ paddingRight: 24, margin: 0, minHeight: 280}}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

_Layout.propTypes = {
  isReady: PropTypes.bool,
  isAuthenticated: PropTypes.bool,
  children: PropTypes.object
};

export default _Layout;
