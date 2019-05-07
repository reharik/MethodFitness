import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Layout from '../components/layout/Layout';
import { getJsonSchema } from './../modules/schemaModule';
import { checkAuth } from './../modules/authModule';
import SignInContainer from './forms/SignInContainer';

class LayoutContainer extends Component {
  componentDidMount() {
    this.loadData();
  }

  loadData() {
    this.props.checkAuth();
    this.props.getJsonSchema();
  }

  render() {
    if (this.props.isAuthenticated) {
      return <Layout isReady={this.props.isReady} userRole={this.props.userRole} />;
    }
    return <SignInContainer />;
  }
}

LayoutContainer.propTypes = {
  getJsonSchema: PropTypes.func,
  checkAuth: PropTypes.func,
  isAuthenticated: PropTypes.bool,
  userRole: PropTypes.string,
  isReady: PropTypes.bool
};

function mapStateToProps(state = []) {
  return {
    isReady: Object.keys(state.schema.definitions).length > 0,
    isAuthenticated: state.auth.isAuthenticated,
    userRole: state.auth.user.role,
  };
}

export default connect(
  mapStateToProps,
  {
    getJsonSchema,
    checkAuth,
  },
)(LayoutContainer);
