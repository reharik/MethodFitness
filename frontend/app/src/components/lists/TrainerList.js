import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentHeader from '../ContentHeader';
import { Table, Radio } from 'antd';
import { browserHistory } from 'react-router';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class TrainerList extends Component {
  state = {
    view: 'active',
    dataSource: this.props.gridConfig.dataSource
  };

  componentWillReceiveProps(newProps) {
    this.changeView(newProps.gridConfig.dataSource, this.state.view);
  }

  onChange = (e) => {
    let dataSource = this.props.gridConfig.dataSource;
    this.changeView(dataSource, e.target.value);
  };

  changeView = (dataSource, view) => {
    switch(view) {
      case 'archived': {
        view = 'archived';
        dataSource = dataSource.filter(x => x.archived);
        break;
      }
      case 'showAll': {
        view = 'showAll';
        break;
      }
      default: {
        view = 'active';
        dataSource = dataSource.filter(x => !x.archived);
      }
    }
    this.setState({view, dataSource});
  };

  render() {
    return (
      <div id="trainerList">
        <ContentHeader>
          <div className="list__header">
            <div className="list__header__left">
              <button
                className="contentHeader__button__new"
                title="New"
                onClick={() => browserHistory.push('/trainer')}
              />
            </div>
            <div className="list__header__center">
              <div className="list__header__center__title">Trainers</div>
            </div>
            <div className="list__header__right">
              <RadioGroup defaultValue="active" size="small" onChange={this.onChange} >
                <RadioButton value="active">Active</RadioButton>
                <RadioButton value="archived">Archived</RadioButton>
                <RadioButton value="showAll">Show All</RadioButton>
              </RadioGroup>
            </div>
          </div>
        </ContentHeader>
        <div className="form-scroll-inner">
          <Table
            columns={this.props.gridConfig.columns(this.props.archiveTrainer, this.props.loggedInUser)}
            dataSource={this.state.dataSource}
            pagination={false}
            rowKey="trainerId"
            scroll={{y: '100%'}}
            size="small"
          />
        </div>
      </div>
    );
  }
}

TrainerList.propTypes = {
  gridConfig: PropTypes.object,
  loggedInUser: PropTypes.string,
  archiveTrainer: PropTypes.func
};

export default TrainerList;
