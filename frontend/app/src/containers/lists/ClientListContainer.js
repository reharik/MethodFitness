import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ClientList from '../../components/lists/ClientList';
import cellLink from '../../components/GridElements/CellLink.js';
import emailLink from '../../components/GridElements/EmailLink.js';
import archiveLink from '../../components/GridElements/ArchiveLink.js';

import { fetchAllClientsAction, archiveClient } from './../../modules/clientModule';

class ClientListContainer extends Component {
  componentWillMount() {
    this.loadData();
  }

  loadData() {
    this.props.fetchAllClientsAction();
  }

  render() {
    return (<ClientList gridConfig={this.props.gridConfig} archiveTrainer={this.props.archiveClient} />);
  }
}

ClientListContainer.propTypes = {
  gridConfig: PropTypes.object,
  archiveClient: PropTypes.func,
  fetchAllClientsAction: PropTypes.func
};

const columns = archiveClient => [
  {
    render: (value, row) => { // eslint-disable-line no-unused-vars
      return cellLink('client')(value, row );
    },
    dataIndex: 'contact.lastName',
    title: 'Last Name',
    width: '10%'
  },
  {
    dataIndex: 'contact.firstName',
    title: 'First Name',
    width: '10%'
  },
  {
    render: emailLink,
    dataIndex: 'contact.email',
    title: 'Email',
    width: '35%'
  },
  {
    dataIndex: 'contact.mobilePhone',
    title: 'Mobile Phone',
    width: '10%'
  },
  {
    render: (value, row) => { // eslint-disable-line no-unused-vars
      return archiveLink(archiveClient)(value, row);
    },
    dataIndex: 'Archived',
    title: 'Archived',
    width: '10%'
  },
  {
    render: ( value, row ) => { // eslint-disable-line no-unused-vars
      return cellLink(`purchases`)( '$$$', row );
    },
    title: '$',
    width: '10%'
  }
];

function mapStateToProps(state) {
  const isAdmin = state.auth.user.role === 'admin';
  let user = state.trainers.find(x => x.id === state.auth.user.id);

  let dataSource = state.clients
    .filter(x => isAdmin || user.clients.includes(x.id))
    .sort((a, b) => {
      const _a = a.contact.lastName.toLowerCase();
      const _b = b.contact.lastName.toLowerCase();
      if (_a > _b) {
        return 1;
      }
      if (_a < _b) {
        return -1;
      }
      return 0;
    });

  const gridConfig = {
    columns,
    dataSource
  };
  return {
    gridConfig
  };
}

export default connect(mapStateToProps, {
  archiveClient,
  fetchAllClientsAction
})(ClientListContainer);
