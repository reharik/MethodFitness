import React from 'react';
import PropTypes from 'prop-types';
import ContentHeader from '../ContentHeader';
import ContentHeaderSearch from '../ContentHeaderSearch';
import { Table } from 'antd';
import { browserHistory } from 'react-router';

const PurchaseList = ({ gridConfig, clientId }) => {
  return (
    <div id="purchaseList">
      <ContentHeader>
        <div className="list__header">
          <div className="list__header__left">
            <button
              className="contentHeader__button__new"
              title="New"
              onClick={() => browserHistory.push(`/purchase/${clientId}`)}
            />
          </div>
          <div className="list__header__center">
            <div className="list__header__center__title">Purchases</div>
          </div>
          <div className="list__header__right">
            <ContentHeaderSearch />
          </div>
        </div>
      </ContentHeader>
      <div className="form-scroll-inner">
        <Table
          {...gridConfig}
          pagination={false}
          rowKey="id"
          scroll={{ y: '100%'}}
          size="small"
        />
      </div>
    </div>
  );
};

PurchaseList.propTypes = {
  gridConfig: PropTypes.object,
  clientId: PropTypes.string
};

export default PurchaseList;
