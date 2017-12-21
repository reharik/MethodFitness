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
    if(!this.props.isAuthenticated) {
      this.props.checkAuth();
    }
    this.props.getJsonSchema();
  }

  render() {
    if (this.props.isAuthenticated) {
      return <Layout {...this.props} />;
    }
    return <SignInContainer />;
  }
}

LayoutContainer.propTypes = {
  getJsonSchema: PropTypes.func,
  fetchAllTrainersAction: PropTypes.func,
  fetchAllClientsAction: PropTypes.func,
  checkAuth: PropTypes.func,
  isFetching: PropTypes.bool,
  errorMessage: PropTypes.string,
  isAuthenticated: PropTypes.bool
};


function mapStateToProps(state = []) {
  return {
    isReady: Object.keys(state.schema.definitions).length > 0,
    isAuthenticated: state.auth.isAuthenticated,
    userName: state.auth.user.userName
  };
}

export default connect(mapStateToProps, {
  getJsonSchema,
  checkAuth
})(LayoutContainer);
