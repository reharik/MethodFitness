import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Layout from '../components/layout/Layout';
import { getJsonSchema } from './../modules/schemaModule';

class LayoutContainer extends Component {
  componentDidMount() {
    this.loadData();
  }

  // XXX this componentDidUpdate() was causing inifinte loop, since we aren't updating yet this deferred but will
  // bee needed next sprint probably
  // this causes infinte loop for some reason
  // componentDidUpdate() { this.loadData(); }

  loadData() {
    this.props.getJsonSchema();
  }

  render() {
    if (this.props.isFetching) {
      return <p style={{ 'padding-top': '100px' }}> Loading... </p>;
    }
    if (this.props.errorMessage) {
      return <p style={{ 'padding-top': '100px' }}>ERROR! -&gt; {this.props.errorMessage}</p>;
    }
    return <Layout {...this.props} />;
  }
}

LayoutContainer.propTypes = {
  getJsonSchema: PropTypes.func,
  isFetching: PropTypes.bool,
  errorMessage: PropTypes.string
};


function mapStateToProps(state = []) {
  return {
    isReady: Object.keys(state.schema.definitions).length > 0,
    isAuthenticated: state.auth.isAuthenticated,
    userName: state.auth.user.userName
  };
}

export default connect(mapStateToProps, { getJsonSchema })(LayoutContainer);
