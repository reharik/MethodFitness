import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ClientList from '../../components/lists/ClientList';
import clientListDefinition from './listDefinition/clientListDefinition';
import { fetchAllClientsAction, archiveClient } from './../../modules/clientModule';
import sortBy from 'sort-by';
import Breakjs from 'breakjs';

const layout = Breakjs({
  mobile: 0,
  tablet: 768,
  laptop: 1201
});

class ClientListContainer extends Component {
  state = {layout: layout.current()};

  componentDidMount() {
    this.setState({layout: layout.current()});
    this.loadData();
    layout.addChangeListener(l => this.setState({layout: l}));
  }

  componentWillUnmount() {
    layout.removeChangeListener(l => this.setState({layout: l}));
  }

  loadData() {
    this.props.fetchAllClientsAction();
  }

  render() {
    let columns = clientListDefinition(this.state.layout, this.props.isAdmin);
    this.gridConfig = {...this.props.gridConfig, columns };
    return (<ClientList gridConfig={this.gridConfig} archiveClient={this.props.archiveClient} />);
  }
}

ClientListContainer.propTypes = {
  gridConfig: PropTypes.object,
  archiveClient: PropTypes.func,
  fetchAllClientsAction: PropTypes.func,
  containerWidth: PropTypes.number,
  isAdmin: PropTypes.bool
};

function mapStateToProps(state) {
  const isAdmin = state.auth.user.role === 'admin';

  let dataSource = state.clients
    .filter(x => isAdmin || state.auth.user.clients.includes(x.clientId))
    .sort(sortBy('contact.lastName'));

  const gridConfig = {
    dataSource
  };
  return {
    isAdmin,
    gridConfig
  };
}

export default connect(mapStateToProps, {
  archiveClient,
  fetchAllClientsAction
})(ClientListContainer);
