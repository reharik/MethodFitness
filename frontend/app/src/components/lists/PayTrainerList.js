import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentHeader from '../ContentHeader';
import { Table, Modal } from 'antd';
const confirm = Modal.confirm;

class PayTrainerList extends Component {
  state = {
    selectedRowKeys: [],
    selectedIds: [],
    trainerTotal: 0
  };

  submitTrainerPayment = () => {
    confirm({
      title: 'Are you sure you would like to pay trainer: ${}?',
      content: `$${this.state.trainerTotal} for ${this.selectedIds.length} Appointments`,
      onOk() {
        const payload = {
          trainerId: this.props.params.trainerId,
          sessionIds: this.state.selectedIds
        };
        this.props.submitTrainerPayment(payload);
      },
      onCancel() {
      }
    });
  };

  onSelect = (record, selected, selectedRows) => {
    let trainerTotal = selectedRows
      .filter(x => x.funded)
      .reduce((a, b) => a + b.trainerPay, 0);
    let selectedRowKeys = selectedRows
      .filter(x => x.funded)
      .map(x => `${x.appointmentId}---${x.clientId}`);
    let selectedIds = selectedRows
      .filter(x => x.funded)
      .map(x => x.sessionId);
    this.setState({trainerTotal, selectedRowKeys, selectedIds});
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
              <button onClick={this.submitTrainerPayment} >Submit Trainer Payment</button>
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
  gridConfig: PropTypes.object,
  params: PropTypes.object,
  submitTrainerPayment: PropTypes.func
};

export default PayTrainerList;
