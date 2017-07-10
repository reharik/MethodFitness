import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TrainerList from '../../components/lists/TrainerList';
import cellLink from '../../components/GridElements/CellLink.js';
import emailLink from '../../components/GridElements/EmailLink.js';
import archiveLink from '../../components/GridElements/ArchiveLink.js';

import { fetchAllTrainersAction, archiveTrainer } from './../../modules/trainerModule';

class TrainerListContainer extends Component {
  componentWillMount() {
    this.loadData();
  }

  loadData() {
    this.props.fetchAllTrainersAction();
  }

  render() {
    return (<TrainerList gridConfig={this.props.gridConfig} archiveTrainer={this.props.archiveTrainer} />);
  }
}

TrainerListContainer.propTypes = {
  gridConfig: PropTypes.object,
  archiveTrainer: PropTypes.func,
  fetchAllTrainersAction: PropTypes.func
};

const columns = (archiveTrainer, loggedInUser) => [
  {
    render: (column, row) => {
      return cellLink('trainer')(column, row);
    },
    dataIndex: 'contact.lastName',
    title: 'Last Name',
    width: '10%',
    sorter: true
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
    render: (column, row) => {
      return archiveLink(archiveTrainer, loggedInUser)(column, row);
    },
    dataIndex: 'archived',
    title: 'Archived',
    width: '10%'
  },
  {
    render: ( value, row ) => { // eslint-disable-line no-unused-vars
      return cellLink(`payTrainer`)( '$$$', row );
    },
    title: '$',
    width: '10%'
  }
];

function mapStateToProps(state) {
  const gridConfig = {
    columns,
    dataSource: state.trainers
  };
  return {
    gridConfig,
    loggedInUser: state.auth.user.id
  };
}

export default connect(mapStateToProps, {
  archiveTrainer,
  fetchAllTrainersAction
})(TrainerListContainer);
