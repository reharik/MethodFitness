import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UpdateDefaultClientRatesForm from '../../components/forms/UpdateDefaultClientRatesForm';
import normalizeModel from '../../utilities/normalizeModel';
import {
  updateDefaultClientRates,
  fetchDefaultClientRates,
} from './../../modules/defaultClientRatesModule';
import { notifications } from './../../modules/notificationModule';

import { actions as notifActions } from 'redux-notifications';
const { notifClear } = notifActions;

class UpdateDefaultClientRatesFormContainer extends Component {
  componentDidMount() {
    this.props.fetchDefaultClientRates();
  }

  render() {
    if (this.props.isFetching) {
      return <p style={{ 'padding-top': '100px' }}> Loading... </p>;
    }
    if (this.props.errorMessage) {
      return (
        <p style={{ 'padding-top': '100px' }}>
          ERROR! -&gt; {this.props.errorMessage}
        </p>
      );
    }

    return <UpdateDefaultClientRatesForm {...this.props} />;
  }
}

UpdateDefaultClientRatesFormContainer.propTypes = {
  params: PropTypes.object,
  fetchDefaultClientRates: PropTypes.func,
  isFetching: PropTypes.func,
  errorMessage: PropTypes.string,
};

const mapStateToProps = (state, props) => {
  const model = normalizeModel(
    state.schema.definitions.defaultClientRates,
    state.defaultClientRates.results[0],
  );

  return {
    model,
  };
};

export default connect(
  mapStateToProps,
  {
    updateDefaultClientRates,
    fetchDefaultClientRates,
    notifications,
    notifClear,
  },
)(UpdateDefaultClientRatesFormContainer);
