import React from 'react';
import PropTypes from 'prop-types';
import ContentHeader from '../ContentHeader';
import { Table } from 'antd';
import { browserHistory } from 'react-router';

const TrainerPaymentList = ({ gridConfig, trainerName, trainerId }) => {
  return (
    <div id="purchaseList">
      <ContentHeader>
        <div className="list__header">
          <div className="list__header__left" />
          <div className="list__header__center">
            <div className="list__header__center__title">Payment History</div>
          </div>
          <div className="list__header__right">
              <a
                className="contentHeader__anchor"
                data-id={'returnToTrainer'}
                onClick={() =>
                  browserHistory.push(`/trainer/${trainerId}`)
                }
              >
                {trainerName}
              </a>
            </div>
        </div>
      </ContentHeader>
      <div className="form-scroll-inner">
        <Table
          {...gridConfig}
          pagination={false}
          rowKey="paymentId"
          scroll={{ y: '100%' }}
          size="small"
        />
      </div>
    </div>
  );
};

TrainerPaymentList.propTypes = {
  gridConfig: PropTypes.object,
  trainerName: PropTypes.string

};

export default TrainerPaymentList;
