import React from 'react';
import PropTypes from 'prop-types';
import NavigationContainer from './../../containers/MenuContainer';
import Header from './../../containers/HeaderContainer';
import {Layout} from 'antd';
const { Content, Sider} = Layout;

const _Layout = ({isReady, children}) => {
  if (!isReady) {
    return null;
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
  children: PropTypes.object
};

export default _Layout;
