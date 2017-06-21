import React from 'react';
import PropTypes from 'prop-types';
import ContentHeader from '../ContentHeader';
import {Table} from 'antd';

const TrainerPaymentList = ({ gridConfig }) => {
  return (
    <div id="purchaseList">
      <ContentHeader>
        <div className="list__header">
          <div className="list__header__left" />
          <div className="list__header__center">
            <div className="list__header__center__title">Payment History</div>
          </div>
          <div className="list__header__right" />
        </div>
      </ContentHeader>
      <div className="form-scroll-inner">
        <Table
          {...gridConfig}
          pagination={false}
          rowKey="id"
          scroll={{ y: '100%' }}
          size="small"
        />
      </div>
    </div>
  );
};

TrainerPaymentList.propTypes = {
  gridConfig: PropTypes.object
};

export default TrainerPaymentList;
