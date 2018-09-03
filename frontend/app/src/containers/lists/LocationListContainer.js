import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LocationList from '../../components/lists/LocationList';
import locationListDefinition from './listDefinition/locationListDefinition';
import {
  fetchAllLocationsAction,
  archiveLocation,
} from './../../modules/locationModule';
import breakjs from 'breakjs';

const layout = breakjs({
  mobile: 0,
  tablet: 768,
  laptop: 1201,
});

class LocationListContainer extends Component {
  state = { layout: layout.current() };

  componentDidMount() {
    this.setState({ layout: layout.current() });
    this.loadData();
    layout.addChangeListener(l => this.setState({ layout: l }));
  }

  componentWillUnmount() {
    layout.removeChangeListener(l => this.setState({ layout: l }));
  }

  loadData() {
    this.props.fetchAllLocationsAction();
  }

  render() {
    let columns = locationListDefinition();
    this.gridConfig = {
      ...this.props.gridConfig,
      columns,
    };
    return (
      <LocationList
        gridConfig={this.gridConfig}
        archiveLocation={this.props.archiveLocation}
        isAdmin={this.props.isAdmin}
      />
    );
  }
}

LocationListContainer.propTypes = {
  gridConfig: PropTypes.object,
  archiveLocation: PropTypes.func,
  fetchAllLocationsAction: PropTypes.func,
  containerWidth: PropTypes.number,
  isAdmin: PropTypes.bool,
};

function mapStateToProps(state) {
  const isAdmin = state.auth.user.role === 'admin';

  const gridConfig = {
    dataSource: state.locations,
  };
  return {
    isAdmin,
    gridConfig,
  };
}

export default connect(
  mapStateToProps,
  {
    archiveLocation,
    fetchAllLocationsAction,
  },
)(LocationListContainer);
