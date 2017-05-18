import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Table from '../components/Table';
import initialize from './../utilities/initialize'
import { sort, setColumns, setConfig } from './../modules/tableModule'
import dataSelector from './../Selectors/dataSelector';

class TableContainer extends Component {
  componentWillMount() {
    initialize(this.props);
    //need args for fetcdata
    this.props.fetchDataAction()
  }
  render() {
    if (this.props.isFetching) {
      return (<p style={{ 'padding-top': '100px' }}> Loading... </p>);
    }
    if (this.props.errorMessage) {
      return (<p style={{ 'padding-top': '100px' }}>ERROR! -> {this.props.errorMessage}</p>);
    }
    return (<Table {...this.props} />);
  }
}

function mapStateToProps(state, ownProps) {
  const table = state.reduxDataTable && state.reduxDataTable[ownProps.config.tableName];
  if(!table) { return {}; }

  const tableData = dataSelector(state[ownProps.config.dataSource], table);
  return {
    columns: table.columns,
    tableData,
    configured:table.configured
  };
}

function mapDispatchToActions(dispatch, ownProps) {
  return bindActionCreators({
    sort: sort(ownProps.config.tableName),
    setConfig,
    setColumns: setColumns(ownProps.config.tableName),
    fetchDataAction: ownProps.config.fetchDataAction
  },dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(TableContainer);
