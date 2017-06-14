import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentHeader from '../ContentHeader';
import ContentHeaderSearch from '../ContentHeaderSearch';
import { Table } from 'antd';

class TrainerVerificationList extends Component {
  state = {
    selectedRowKeys: [],
    trainerTotal: 0
  };

  onSelect = (record, selected, selectedRows) => {
    let trainerTotal = selectedRows
      .filter(x => x.funded)
      .reduce((a, b) => a + b.trainerPay, 0);
    let selectedRowKeys = selectedRows
      .filter(x => x.funded)
      .map(x => `${x.appointmentId}---${x.clientId}`);
    this.setState({trainerTotal, selectedRowKeys});
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
                {`Trainer Verification.  Trainer Total: ${this.state.trainerTotal}`}
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

TrainerVerificationList.propTypes = {
  gridConfig: PropTypes.object
};

export default TrainerVerificationList;
