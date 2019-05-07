import ContentHeader from '../ContentHeader';
import PropTypes from 'prop-types';
import React from 'react';
import { Table } from 'antd';
import { withRouter } from 'react-router-dom';

const TrainerPaymentDetailsList = ({
  gridConfig,
  paymentTotal,
  paymentDate,
  trainerId,
}) => (
  <div id="trainerVerificationList">
    <ContentHeader>
      <div className="list__header">
        <div className="list__header__left">
          {/*put trainer pay total in here*/}
        </div>
        <div className="list__header__center">
          <div className="list__header__center__title">
            Payment Date: {paymentDate} - Payment Total: ${paymentTotal.toFixed(
              2,
            )}
          </div>
        </div>
        <div className="list__header__right">
          <a
            className="contentHeader__anchor"
            data-id={'returnToTrainer'}
            onClick={() => this.props.history.push(`/trainerPayments/${trainerId}`)}
          >
            Return to Trainer Payments
          </a>
        </div>
      </div>
    </ContentHeader>
    <div className="form-scroll-inner">
      <Table
        {...gridConfig}
        pagination={false}
        rowKey={row => `${row.appointmentId}---${row.clientId}`}
        scroll={{ y: '100%' }}
        size="small"
      />
    </div>
  </div>
);

TrainerPaymentDetailsList.propTypes = {
  gridConfig: PropTypes.object,
  paymentDate: PropTypes.string,
  paymentTotal: PropTypes.number,
  history: PropTypes.object
};

export default withRouter(TrainerPaymentDetailsList);
