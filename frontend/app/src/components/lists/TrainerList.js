import React from 'react';
import PropTypes from 'prop-types';
import ContentHeader from '../ContentHeader';
import ContentHeaderSearch from '../ContentHeaderSearch';
import { Table } from 'antd';
import { browserHistory } from 'react-router';

const TrainerList = ({ gridConfig, archiveTrainer, loggedInUser }) => {
  return (
    <div id="trainerList">
      <ContentHeader>
        <div className="list__header">
          <div className="list__header__left">
            <button
              className="contentHeader__button__new"
              title="New"
              onClick={() => browserHistory.push('/trainer')}
            />
          </div>
          <div className="list__header__center">
            <div className="list__header__center__title">Trainers</div>
          </div>
          <div className="list__header__right">
            <ContentHeaderSearch />
          </div>
        </div>
      </ContentHeader>
      <div className="form-scroll-inner">
        <Table
          columns={gridConfig.columns(archiveTrainer, loggedInUser)}
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

TrainerList.propTypes = {
  gridConfig: PropTypes.object,
  loggedInUser: PropTypes.string,
  archiveTrainer: PropTypes.func
};

export default TrainerList;
