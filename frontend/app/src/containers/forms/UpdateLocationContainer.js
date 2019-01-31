import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UpdateLocationForm from '../../components/forms/UpdateLocationForm';
import normalizeModel from '../../utilities/normalizeModel';
import sources from './../../constants/sources';
import {
  updateLocation,
  fetchLocationAction,
} from './../../modules/locationModule';
import { notifications } from './../../modules/notificationModule';

import { actions as notifActions } from 'redux-notifications';
const { notifClear } = notifActions;

class UpdateLocationFormContainer extends Component {
  UNSAFE_componentWillMount() {
    this.loadData();
  }

  loadData() {
    if (this.props.params.locationId) {
      this.props.fetchLocationAction(this.props.params.locationId);
    }
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

    return <UpdateLocationForm {...this.props} />;
  }
}

UpdateLocationFormContainer.propTypes = {
  params: PropTypes.object,
  fetchLocationAction: PropTypes.func,
  isFetching: PropTypes.func,
  errorMessage: PropTypes.string,
};

const mapStateToProps = (state, props) => {
  const location = state.locations.find(
    x => x.locationId === props.params.locationId,
  );
  const model = normalizeModel(state.schema.definitions.location, location);

  return {
    model,
    sources,
    locationId: location ? location.locationId : null,
  };
};

export default connect(
  mapStateToProps,
  {
    updateLocation,
    fetchLocationAction,
    notifications,
    notifClear,
  },
)(UpdateLocationFormContainer);
