import React from 'react';
import ContentHeader from '../ContentHeader';
import ContentHeaderSearch from '../ContentHeaderSearch';
import { Table } from 'redux-datatable';
import { browserHistory } from 'react-router';

const ClientList = ({ gridConfig, columns, archiveClient }) => {
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
        <div className="content-inner">
          <Table columns={columns(archiveClient)} config={gridConfig} />
        </div>
      </div>
    </div>
  );
};

ClientList.contextTypes = {
  gridConfig: React.PropTypes.object
};

export default ClientList;
