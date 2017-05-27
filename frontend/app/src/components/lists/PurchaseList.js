import React from 'react';
import PropTypes from 'prop-types';
import ContentHeader from '../ContentHeader';
import ContentHeaderSearch from '../ContentHeaderSearch';
import { Table } from 'redux-datatable';
import { browserHistory } from 'react-router';

const PurchaseList = ({ gridConfig, columns, params }) => {
  return (
    <div id="purchaseList">
      <ContentHeader>
        <div className="list__header">
          <div className="list__header__left">
            <button
              className="contentHeader__button__new"
              title="New"
              onClick={() => browserHistory.push(`/purchase/${params.clientId}`)}
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
        <div className="content-inner">
          <Table columns={columns()} config={gridConfig} />
        </div>
      </div>
    </div>
  );
};

PurchaseList.propTypes = {
  gridConfig: PropTypes.object,
  columns: PropTypes.func,
  params: PropTypes.object
};

export default PurchaseList;
