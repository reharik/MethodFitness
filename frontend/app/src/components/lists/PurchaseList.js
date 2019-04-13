import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentHeader from '../ContentHeader';
import { Table, Modal } from 'antd';
import { browserHistory } from 'react-router';
import riMoment from './../../utilities/riMoment';
import appointmentTypes from './../../constants/appointmentTypes';

import Breakjs from 'breakjs';
const confirm = Modal.confirm;

// eslint-disable-next-line new-cap
const layout = Breakjs({
  mobile: 0,
  tablet: 768,
  laptop: 1201,
});

class PurchaseList extends Component {
  state = {
    purchases: [],
    layout: layout.current(),
  };

  componentDidMount() {
    layout.addChangeListener(l => this.setState(state => ({ ...state, l })));
  }

  componentWillUnmount() {
    layout.removeChangeListener(l => this.setState(state => ({ ...state, l })));
  }

  submitRefund = () => {
    let refund = 0;
    let refundSessions = [];
    Object.keys(this.state.purchases).forEach(x => {
      if (
        this.state.purchases[x].refundTotal &&
        this.state.purchases[x].refundTotal > 0
      ) {
        refund += this.state.purchases[x].refundTotal || 0;
        const selectedRowKeys = this.state.purchases[x].selectedRowKeys;
        refundSessions = selectedRowKeys.concat(refundSessions);
      }
    });
    this.confirmRefund(refundSessions, refund);
  };

  confirmRefund = (refundSessions, refund) =>
    confirm({
      title: 'Are you sure you would like to Refund?',
      content: `${refundSessions.length} Sessions for $${refund.toFixed(2)}`,
      okText: 'OK',
      cancelText: 'Cancel',
      onOk: () => {
        const payload = {
          clientId: this.props.clientId,
          refundSessions,
        };
        this.props.refundSessions(payload);
        this.setState({
          purchases: {},
        });
      },
      onCancel() {},
    });

  updateSelectedRows = (purchaseId, selectedRows) => {
    let selectedRowKeys = selectedRows.map(x => ({
      sessionId: x.sessionId,
      appointmentType: x.appointmentType,
    }));
    let purchases = {
      ...this.state.purchases,
      [purchaseId]: {
        selectedRowKeys,
        refundTotal: selectedRows.reduce((a, b) => a + b.purchasePrice, 0),
      },
    };
    this.setState({ purchases });
  };

  onSelect = (record, selected, selectedRows) => {
    const purchaseId = record.purchaseId;
    this.updateSelectedRows(purchaseId, selectedRows);
  };

  onSelectAll = (selected, selectedRows, changeRows) => {
    const purchaseId = changeRows[0].purchaseId;
    this.updateSelectedRows(purchaseId, selectedRows);
  };

  getCheckboxProps = record => ({
    disabled: record.refunded,
  });

  expandRowRender = data => {
    const source = this.props.sessionsDataSource.filter(
      x => x.purchaseId === data.purchaseId,
    );
    const selectedRowKeys = (this.state.purchases[data.purchaseId]
      ? this.state.purchases[data.purchaseId].selectedRowKeys
      : []
    ).map(x => x.sessionId);
    let rowSelection = {
      selectedRowKeys,
      onSelect: this.onSelect,
      onSelectAll: this.onSelectAll,
      getCheckboxProps: this.getCheckboxProps,
    };

    const columns = [
      {
        render: val => (val ? `${val.substring(0, 8)}` : val), // eslint-disable-line no-confusing-arrow
        dataIndex: 'sessionId',
        title: 'Session Id',
      },
      {
        render: val => {
          const type = appointmentTypes.find(x => x.value === val);
          return type ? type.display : '';
        },
        dataIndex: 'appointmentType',
        title: 'Appointment Type',
      },
      {
        render: val => (val ? riMoment(val).format('L') : val), // eslint-disable-line no-confusing-arrow
        dataIndex: 'appointmentDate',
        title: 'Date',
      },
      {
        render: val => (val ? riMoment(val).format('LT') : val), // eslint-disable-line no-confusing-arrow
        dataIndex: 'startTime',
        title: 'Start Time',
      },
      {
        render: val => (val ? `${val.substring(0, 8)}` : val), // eslint-disable-line no-confusing-arrow
        dataIndex: 'appointmentId',
        title: 'Appointment Id',
      },
      {
        render: val => (val ? `Refunded` : val), // eslint-disable-line no-confusing-arrow
        dataIndex: 'refunded',
        title: 'Refunded',
      },
      {
        render: val => (val ? `$${val}` : val), // eslint-disable-line no-confusing-arrow
        dataIndex: 'purchasePrice',
        title: 'Total',
      },
    ];

    const getRowClass = row => {
      if (row.appointmentId) {
        return 'row-gray';
      }
      if (row.refunded) {
        return 'row-salmon';
      }
      return '';
    };

    return (
      <Table
        columns={columns}
        rowKey="sessionId"
        rowClassName={getRowClass}
        dataSource={source}
        rowSelection={this.props.isAdmin ? rowSelection : null}
        pagination={false}
      />
    );
  };

  render() {
    let hasRefundableItems = this.props.sessionsDataSource.some(
      x => !x.refunded && !x.appointmentId,
    );

    return (
      <div id="purchaseList">
        <ContentHeader>
          <div className="list__header">
            <div className="list__header__left">
              <button
                className="contentHeader__button__new"
                title="New"
                onClick={() =>
                  browserHistory.push(`/purchase/${this.props.clientId}`)
                }
              />
              {hasRefundableItems && this.props.isAdmin ? (
                <button
                  className="contentHeader__button"
                  onClick={this.submitRefund}
                >
                  Submit Refund
                </button>
              ) : null}
            </div>
            <div className="list__header__center">
              <div className="list__header__center__title">Purchases</div>
            </div>
            <div className="list__header__right">
              <button
                className="contentHeader__button"
                onClick={() =>
                  browserHistory.push(`/client/${this.props.params.clientId}`)
                }
              >
                Return to Client
              </button>
            </div>
          </div>
        </ContentHeader>
        <div className="form-scroll-inner">
          <Table
            {...this.props.gridConfig}
            pagination={false}
            scroll={{ y: '100%' }}
            size="small"
            expandedRowRender={
              this.state.layout !== 'mobile' ? this.expandRowRender : null
            }
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
  refundSessions: PropTypes.func,
  isAdmin: PropTypes.bool,
  sessionsDataSource: PropTypes.array,
};

export default PurchaseList;
