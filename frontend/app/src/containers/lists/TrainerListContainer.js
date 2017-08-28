import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TrainerList from '../../components/lists/TrainerList';
import { fetchAllTrainersAction, archiveTrainer } from './../../modules/trainerModule';
import trainerListDefinition from './listDefinition/trainerListDefinition';
import sortBy from 'sort-by';
import Breakjs from 'breakjs';

const layout = Breakjs({
  mobile: 0,
  tablet: 768,
  laptop: 1201
});

class TrainerListContainer extends Component {
  state = {layout: layout.current()};

  componentDidMount() {
    this.loadData();
    layout.addChangeListener(layout => this.setState({layout}));
  }

  componentWillUnmount() {
    layout.removeChangeListener(layout => this.setState({layout}));
  }

  loadData() {
    this.props.fetchAllTrainersAction();
  }

  render() {
    let columns = trainerListDefinition(this.state.layout);
    this.gridConfig = {...this.props.gridConfig, columns };
    return (<TrainerList
      gridConfig={this.gridConfig}
      archiveTrainer={this.props.archiveTrainer}
      loggedInUser={this.props.loggedInUser} />);
  }
}

TrainerListContainer.propTypes = {
  gridConfig: PropTypes.object,
  loggedInUser: PropTypes.string,
  archiveTrainer: PropTypes.func,
  fetchAllTrainersAction: PropTypes.func
};

function mapStateToProps(state) {
  const gridConfig = {
    dataSource: state.trainers.sort(sortBy('contact.lastName'))
  };
  return {
    gridConfig,
    loggedInUser: state.auth.user.trainerId
  };
}

export default connect(mapStateToProps, {
  archiveTrainer,
  fetchAllTrainersAction
})(TrainerListContainer);
