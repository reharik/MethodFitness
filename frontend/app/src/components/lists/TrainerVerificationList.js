import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentHeader from '../ContentHeader';
import { Table, Modal } from 'antd';
const confirm = Modal.confirm;
import trainerVerificationListDefinition from './../../containers/lists/listDefinition/trainerVerificationListDefinition';
import Breakjs from 'breakjs';

// eslint-disable-next-line new-cap
const layout = Breakjs({
  mobile: 0,
  tablet: 768,
  laptop: 1201,
});

class TrainerVerificationList extends Component {
  state = {
    selectedRowKeys: [],
    selectedIds: [],
    trainerTotal: 0,
    layout: layout.current(),
  };

  componentDidMount() {
    layout.addChangeListener(layout => this.setState({ layout })); // eslint-disable-line no-shadow
  }

  componentWillUnmount() {
    layout.removeChangeListener(layout => this.setState({ layout })); // eslint-disable-line no-shadow
  }

  submitVerification = () => {
    let that = this;
    if (this.state.selectedIds.length > 0) {
      confirm({
        title: 'Are you sure you would like to Verify?',
        content: `${
          this.state.selectedIds.length
        } Appointments for $${this.state.trainerTotal.toFixed(2)}`,
        okText: 'OK',
        cancelText: 'Cancel',
        onOk() {
          const payload = {
            sessionIds: that.state.selectedIds,
          };
          that.props.verifyAppointments(payload);
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
    let trainerTotal = selectedRows.reduce((a, b) => a + b.trainerPay, 0);
    let selectedRowKeys = selectedRows.map(
      x => `${x.appointmentId}---${x.clientId}`,
    );
    let selectedIds = selectedRows.map(x => x.sessionId);
    this.setState({ trainerTotal, selectedRowKeys, selectedIds });
  };

  getCheckboxProps = record => ({ disabled: !record.sessionId });

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onSelect: this.onSelect,
      onSelectAll: this.onSelect,
      onChange: this.onSelectChange,
      getCheckboxProps: this.getCheckboxProps,
    };
    this.gridConfig = {
      ...this.props.gridConfig,
      columns: trainerVerificationListDefinition(this.state.layout),
    };
    return (
      <div id="trainerVerificationList">
        <ContentHeader>
          <div className="list__header">
            <div className="list__header__left">
              <button
                className="contentHeader__button"
                onClick={this.submitVerification}
              >
                Submit Verification{' '}
              </button>
            </div>
            <div className="list__header__center">
              <div className="list__header__center__title">
                {`Trainer Verification.  Trainer Total: $${this.state.trainerTotal.toFixed(
                  2,
                )}`}
              </div>
            </div>
            <div className="list__header__right" />
          </div>
        </ContentHeader>
        <div className="form-scroll-inner">
          <Table
            {...this.gridConfig}
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

TrainerVerificationList.propTypes = {
  gridConfig: PropTypes.object,
  verifyAppointments: PropTypes.func,
};

export default TrainerVerificationList;
