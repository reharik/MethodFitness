import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TrainerList from '../../components/lists/TrainerList';
import {
  fetchAllTrainersAction,
  archiveTrainer,
} from './../../modules/trainerModule';
import trainerListDefinition from './listDefinition/trainerListDefinition';
import sortBy from 'sort-by';
import breakjs from 'breakjs';

const layout = breakjs({
  mobile: 0,
  tablet: 768,
  laptop: 1201,
});

class TrainerListContainer extends Component {
  state = { layout: layout.current() };

  componentDidMount() {
    this.loadData();
    layout.addChangeListener(l => this.setState({ layout: l }));
  }

  componentWillUnmount() {
    layout.removeChangeListener(l => this.setState({ layout: l }));
  }

  loadData() {
    this.props.fetchAllTrainersAction();
  }

  render() {
    let columns = trainerListDefinition(this.state.layout);
    this.gridConfig = {
      ...this.props.gridConfig,
      columns,
    };
    return (
      <TrainerList
        gridConfig={this.gridConfig}
        archiveTrainer={this.props.archiveTrainer}
        loggedInUser={this.props.loggedInUser}
      />
    );
  }
}

TrainerListContainer.propTypes = {
  gridConfig: PropTypes.object,
  loggedInUser: PropTypes.string,
  archiveTrainer: PropTypes.func,
  fetchAllTrainersAction: PropTypes.func,
};

function mapStateToProps(state) {
  const gridConfig = {
    dataSource: state.trainers.results.sort(sortBy('contact.lastName')),
  };
  return {
    gridConfig,
    loggedInUser: state.auth.user.trainerId,
  };
}

export default connect(
  mapStateToProps,
  {
    archiveTrainer,
    fetchAllTrainersAction,
  },
)(TrainerListContainer);
