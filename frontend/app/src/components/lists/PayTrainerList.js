import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentHeader from '../ContentHeader';
import { Table, Modal } from 'antd';
const confirm = Modal.confirm;

class PayTrainerList extends Component {
  state = {
    selectedRowKeys: [],
    selectedIds: [],
    trainerTotal: 0,
  };

  submitTrainerPayment = () => {
    let that = this;
    if (this.state.selectedIds.length > 0) {
      confirm({
        title: `Are you sure you would like to pay trainer: ${
          this.props.trainerName
        }?`,
        content: `$${this.state.trainerTotal.toFixed(2)} for ${
          this.state.selectedIds.length
        } Appointments`,
        okText: 'OK',
        cancelText: 'Cancel',
        onOk() {
          const payload = {
            trainerId: that.props.params.trainerId,
            paymentTotal: that.state.trainerTotal,
            paidAppointments: that.state.selectedIds,
          };
          that.props.submitTrainerPayment(payload);
          that.setState({
            selectedRowKeys: [],
            selectedIds: [],
            trainerTotal: 0,
          });
        },
        onCancel() {},
      });
    }
  };

  onSelect = (record, selected, selectedRows) => {
    let trainerTotal = selectedRows
      .filter(x => x.sessionId)
      .reduce((a, b) => a + b.trainerPay, 0);
    let selectedRowKeys = selectedRows
      .filter(x => x.sessionId)
      .map(x => `${x.appointmentId}---${x.clientId}`);
    let selectedIds = selectedRows.filter(x => x.sessionId).map(x => ({
      sessionId: x.sessionId,
      appointmentId: x.appointmentId,
      clientId: x.clientId,
    }));
    this.setState({ trainerTotal, selectedRowKeys, selectedIds });
  };

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onSelect: this.onSelect,
      onSelectAll: this.onSelect,
      onChange: this.onSelectChange,
    };

    return (
      <div id="trainerVerificationList">
        <ContentHeader>
          <div className="list__header">
            <div className="list__header__left">
              <button
                className="contentHeader__button"
                onClick={this.submitTrainerPayment}
              >
                Submit Trainer Payment
              </button>
            </div>
            <div className="list__header__center">
              <div className="list__header__center__title">
                {`Pay Trainer.  Trainer Total: ${this.state.trainerTotal.toFixed(
                  2,
                )}`}
              </div>
            </div>
            <div className="list__header__right" />
          </div>
        </ContentHeader>
        <div className="form-scroll-inner">
          <Table
            {...this.props.gridConfig}
            rowSelection={rowSelection}
            rowClassName={row => (!row.sessionId ? 'row-in-arrears' : '')} // eslint-disable-line no-confusing-arrow
            pagination={false}
            rowKey={row => `${row.appointmentId}---${row.clientId}`}
            scroll={{ y: '100%' }}
            size="small"
          />
        </div>
      </div>
    );
  }
}

PayTrainerList.propTypes = {
  gridConfig: PropTypes.object,
  params: PropTypes.object,
  trainerName: PropTypes.string,
  submitTrainerPayment: PropTypes.func,
};

export default PayTrainerList;
