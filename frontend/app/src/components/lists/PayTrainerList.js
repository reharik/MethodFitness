import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentHeader from '../ContentHeader';
import ContentHeaderSearch from '../ContentHeaderSearch';
import { Table } from 'antd';

class PayTrainerList extends Component {
  state = {
    selectedRowKeys: [],
    trainerTotal: 0
  };

  onSelect = (record, selected, selectedRows) => {
    var trainerTotal = selectedRows.reduce((a, b) => a + b.trainerPay, 0);
    this.setState({trainerTotal});
  };

  onSelectChange = (selectedRowKeys) => {
    this.setState({selectedRowKeys});
  };

  render() {
    const {selectedRowKeys} = this.state;
    const rowSelection = {
      selectedRowKeys,
      onSelect: this.onSelect,
      onSelectAll: this.onSelect,
      onChange: this.onSelectChange
    };

    return (
      <div id="trainerVerificationList">
        <ContentHeader>
          <div className="list__header">
            <div className="list__header__left">
              {/*put trainer pay total in here*/}
            </div>
            <div className="list__header__center">
              <div className="list__header__center__title">
                {`Pay Trainer.  Trainer Total: ${this.state.trainerTotal}`}
              </div>
            </div>
            <div className="list__header__right">
              <ContentHeaderSearch />
            </div>
          </div>
        </ContentHeader>
        <div className="form-scroll-inner">
          <Table
            {...this.props.gridConfig}
            rowSelection={rowSelection}
            rowClassName={row => !row.sessionId ? 'row-in-arrears' : ''}
            pagination={false}
            rowKey={(row) => `${row.appointmentId}---${row.clientId}`}
            scroll={{y: '100%'}}
            size="small"
          />
        </div>
      </div>
    );
  }
}

PayTrainerList.propTypes = {
  gridConfig: PropTypes.object
};

export default PayTrainerList;
