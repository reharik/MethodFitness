import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentHeader from '../ContentHeader';
import ContentHeaderSearch from '../ContentHeaderSearch';
import { Table, Radio } from 'antd';
import { browserHistory } from 'react-router';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class ClientList extends Component {
  state = {
    view: 'active',
    dataSource: this.props.gridConfig.dataSource
  };

  componentWillReceiveProps(newProps) {
    let newState = this.changeView(newProps.gridConfig.dataSource, this.state.view);
    this.setState(newState);
  }

  onChange = (e) => {
    let dataSource = this.props.gridConfig.dataSource;
    let newState = this.changeView(dataSource, e.target.value);
    this.setState(newState);
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
    return {dataSource, view};
  };

  search = (e) => {
    let tgt = e.target.value;
    let freshDataSource = this.changeView(this.props.gridConfig.dataSource, this.state.view).dataSource;

    const filter = x =>
      x.contact.lastName.toLowerCase().startsWith(tgt.toLowerCase())
    || x.contact.firstName.toLowerCase().startsWith(tgt.toLowerCase());
    const newDataSource = freshDataSource.filter(filter);

    let newState = this.changeView(newDataSource, this.state.view);
    this.setState({dataSource: newState.dataSource});
  };

  render() {
    return (
      <div id="clientList">
        <ContentHeader>
          <div className="list__header">
            <div className="list__header__left">
              <button
                className="contentHeader__button__new"
                title="New"
                onClick={() => browserHistory.push('/client')} />
            </div>
            <div className="list__header__center">
              <div className="list__header__center__title">Clients</div>
            </div>
            <div className="list__header__right" >
              <RadioGroup defaultValue="active" size="small" onChange={this.onChange} >
                <RadioButton value="active">Active</RadioButton>
                <RadioButton value="archived">Archived</RadioButton>
                <RadioButton value="showAll">Show All</RadioButton>
              </RadioGroup>
              <ContentHeaderSearch search={this.search} />
            </div>
          </div>
        </ContentHeader>
        <div className="form-scroll-inner">
          <Table
            columns={this.props.gridConfig.columns(this.props.archiveClient)}
            dataSource={this.state.dataSource}
            pagination={false}
            rowKey="clientId"
            scroll={{y: '100%'}}
            size="small"
          />
        </div>
      </div>
    );
  }
}

ClientList.propTypes = {
  gridConfig: PropTypes.object,
  columns: PropTypes.func,
  archiveClient: PropTypes.func
};

export default ClientList;
