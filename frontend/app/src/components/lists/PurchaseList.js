import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentHeader from '../ContentHeader';
import { Table, Modal } from 'antd';
import { browserHistory } from 'react-router';
import moment from 'moment';
const confirm = Modal.confirm;

class PurchaseList extends Component {
  state = {
    selectedRowKeys: [],
    refund: 0
  };

  submitVerification = () => {
    let that = this;
    if (this.state.selectedRowKeys.length > 0) {
      confirm({
        title: 'Are you sure you would like to Refund?',
        content: `${this.state.selectedRowKeys.length} Sessions for $${this.state.refund.toFixed(2)}`,
        okText: 'OK',
        cancelText: 'Cancel',
        onOk() {
          const payload = {
            clientId: that.props.clientId
          };
          const sessions = that.props.gridConfig.dataSource.reduce((a, b) => a.concat(b.sessions), []);

          payload.refundSessions = that.state.selectedRowKeys.map(x => ({
            sessionId: x,
            appointmentType: sessions.find(y => y.sessionId === x).appointmentType}));

          that.props.refundSessions(payload);
          that.setState({
            selectedRowKeys: [],
            trainerTotal: 0
          });
        },
        onCancel() {
        }
      });
    }
  };

  onSelect = (record, selected) => {
    if(record.appointmentId) {
      return;
    }
    let refund = selected
    ? this.state.refund + record.purchasePrice
    : this.state.refund - record.purchasePrice;

    let selectedRowKeys = selected
      ? [...this.state.selectedRowKeys, record.sessionId]
        : this.state.selectedRowKeys.filter(x => x !== record.sessionId);

    this.setState({refund, selectedRowKeys});
  };

  expandRowRender = (data) => {
    const {selectedRowKeys} = this.state;
    let rowSelection = {
      selectedRowKeys,
      onSelect: this.onSelect,
      onSelectAll: this.onSelect,
      onChange: this.onSelectChange
    };

    const columns = [
      {
        render: val => val ? `${val.substring(0, 8)}` : val,
        dataIndex: 'sessionId',
        title: 'Session Id'
      },
      {
        dataIndex: 'appointmentType',
        title: 'Appointment Type'
      },
      {
        render: val => val ? moment(val).format('L') : val,
        dataIndex: 'appointmentDate',
        title: 'Date'
      },
      {
        render: val => val ? moment(val).format('LT') : val,
        dataIndex: 'startTime',
        title: 'Start Time'
      },
      {
        render: val => val ? `${val.substring(0, 8)}` : val,
        dataIndex: 'appointmentId',
        title: 'Appointment Id'
      },
      {
        render: val => val ? `Refunded` : val,
        dataIndex: 'refunded',
        title: 'Refunded'
      },
      {
        render: val => val ? `$${val}` : val,
        dataIndex: 'purchasePrice',
        title: 'Total'
      }];

    const getRowClass = (row) => {
      if(row.appointmentId) {
        return 'row-gray';
      }
      if(row.refunded) {
        return 'row-salmon';
      }
      return '';
    };

    return (
      <Table
        columns={columns}
        rowKey="sessionId"
        rowClassName={getRowClass}
        dataSource={data.sessions}
        rowSelection={rowSelection}
        pagination={false}
      />
    );
  };

  render() {
    return (
      <div id="purchaseList">
        <ContentHeader>
          <div className="list__header">
            <div className="list__header__left">
              <button
                className="contentHeader__button__new"
                title="New"
                onClick={() => browserHistory.push(`/purchase/${this.props.clientId}`)}
              />
              <button className="contentHeader__button" onClick={this.submitVerification} >Submit Refund</button>
            </div>
            <div className="list__header__center">
              <div className="list__header__center__title">Purchases</div>
            </div>
            <div className="list__header__right" />
          </div>
        </ContentHeader>
        <div className="form-scroll-inner">
          <Table
            {...this.props.gridConfig}
            pagination={false}
            scroll={{y: '100%'}}
            size="small"
            expandedRowRender={this.expandRowRender}
            rowKey="purchaseId"
          />
        </div>
      </div>
    );
  }
}

PurchaseList.propTypes = {
  gridConfig: PropTypes.object,
  clientId: PropTypes.string,
  refundSessions: PropTypes.func
};

export default PurchaseList;
