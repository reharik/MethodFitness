import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Layout from '../components/layout/Layout';
import { getJsonSchema } from './../modules/schemaModule';
import { fetchAllClientsAction } from './../modules/clientModule';
import { fetchAllTrainersAction } from './../modules/trainerModule';
import SignInContainer from './forms/SignInContainer';

class LayoutContainer extends Component {
  componentDidMount() {
    this.loadData();
  }

  loadData() {
    this.props.getJsonSchema();
    if (this.props.isAuthenticated) {
      this.props.fetchAllClientsAction();
      this.props.fetchAllTrainersAction();
    }
  }

  render() {
    if (this.props.isFetching) {
      return <p style={{ 'padding-top': '100px' }}> Loading... </p>;
    }
    if (this.props.errorMessage) {
      return <p style={{ 'padding-top': '100px' }}>ERROR! -&gt; {this.props.errorMessage}</p>;
    }
    if (!this.props.isAuthenticated) {
      return <SignInContainer />;
    }
    return <Layout {...this.props} />;
  }
}

LayoutContainer.propTypes = {
  getJsonSchema: PropTypes.func,
  fetchAllTrainersAction: PropTypes.func,
  fetchAllClientsAction: PropTypes.func,
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
  fetchAllClientsAction,
  fetchAllTrainersAction
})(LayoutContainer);
