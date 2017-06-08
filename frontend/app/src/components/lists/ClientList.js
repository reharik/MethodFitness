import React from 'react';
import PropTypes from 'prop-types';
import ContentHeader from '../ContentHeader';
import ContentHeaderSearch from '../ContentHeaderSearch';
import { Table } from 'antd';
import { browserHistory } from 'react-router';

const ClientList = ({ gridConfig, archiveClient }) => {
  return (
    <div id="clientList">
      <ContentHeader>
        <div className="list__header">
          <div className="list__header__left">
            <button className="contentHeader__button__new" title="New" onClick={() => browserHistory.push('/client')} />
          </div>
          <div className="list__header__center">
            <div className="list__header__center__title">Clients</div>
          </div>
          <div className="list__header__right">
            <ContentHeaderSearch />
          </div>
        </div>
      </ContentHeader>
      <div className="form-scroll-inner">
        <Table
          columns={gridConfig.columns(archiveClient)}
          dataSource={gridConfig.dataSource}
          pagination={false}
          rowKey="id"
          scroll={{ y: '100%'}}
          size="small"
        />
      </div>
    </div>
  );
};

ClientList.propTypes = {
  gridConfig: PropTypes.object,
  columns: PropTypes.func,
  archiveClient: PropTypes.func
};

export default ClientList;
