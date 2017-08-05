import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentHeader from '../ContentHeader';
import { Table, Modal } from 'antd';
import { browserHistory } from 'react-router';
import moment from 'moment';
import Breakjs from 'breakjs';
const confirm = Modal.confirm;

const layout = Breakjs({
  mobile: 0,
  tablet: 768,
  laptop: 1201
});

class PurchaseList extends Component {
  state = {
    purchases: {},
    layout: layout.current()
  };

  componentWillMount() {
    layout.addChangeListener(layout => this.setState({layout}));
  }

  componentWillUnmount() {
    layout.removeChangeListener(layout => this.setState({layout}));
  }

  submitVerification = () => {
    let that = this;
    let refund = 0;
    Object.keys(this.state.purchases).forEach(x => {
      refund += this.state.purchases[x].refundTotal;
    });
    if (refund > 0) {
      let refundSessions = [];
      Object.keys(this.state.purchases).forEach(x => {
        refundSessions = refundSessions.concat(this.state.purchases[x].selectedRowKeys);
      });
      confirm({
        title: 'Are you sure you would like to Refund?',
        content: `${refundSessions.length} Sessions for $${refund.toFixed(2)}`,
        okText: 'OK',
        cancelText: 'Cancel',
        onOk() {
          const payload = {
            clientId: that.props.clientId,
            refundSessions
          };
          that.props.refundSessions(payload);
          that.setState({
            purchases: {}
          });
        },
        onCancel() {
        }
      });
    }
  };

  updateSelectedRows = (purchaseId, selectedRows) => {
    let selectedRowKeys = selectedRows
      .map(x => x.sessionId);
    let purchases = {...this.state.purchases,
      [purchaseId]: {
        selectedRowKeys,
        refundTotal: selectedRows.reduce((a, b) => a + b.purchasePrice, 0)
      }
    };
    this.setState({purchases});
  };

  onSelect = (record, selected, selectedRows) => {
    const purchaseId = record.purchaseId;
    this.updateSelectedRows(purchaseId, selectedRows);
  };

  onSelectAll = (selected, selectedRows, changeRows) => {
    const purchaseId = changeRows[0].purchaseId;
    this.updateSelectedRows(purchaseId, selectedRows);
  };

  getCheckboxProps = record => ({ disabled: !!record.refunded || !!record.appointmentId });

  expandRowRender = (data) => {
    const selectedRowKeys = this.state.purchases[data.purchaseId]
      ? this.state.purchases[data.purchaseId].selectedRowKeys
        : [];
    let rowSelection = {
      selectedRowKeys,
      onSelect: this.onSelect,
      onSelectAll: this.onSelectAll,
      getCheckboxProps: this.getCheckboxProps
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
    let hasRefundableItems = this.props.gridConfig.dataSource
      .reduce((a, b) => a.concat(b.sessions), [])
      .some(x => !x.refunded && !x.appointmentId);
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
              {hasRefundableItems
                ? <button className="contentHeader__button" onClick={this.submitVerification} >Submit Refund</button>
                  : null }
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
            expandedRowRender={this.state.layout !== 'mobile' ? this.expandRowRender : null}
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
