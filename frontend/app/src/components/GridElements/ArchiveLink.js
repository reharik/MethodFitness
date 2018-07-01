import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { message } from 'antd';

const ArchiveLink = (action, loggedInUser, idName = 'id') => {
  const link = (value, row) => {
    const result = {
      [idName]: row[idName],
      archived: value,
      date: moment().toISOString(),
    };
    const archiveClick = result => {
      if (result[idName] === loggedInUser) {
        message.info('You may not archive the currently logged in User', 8);
        return;
      }
      action(result);
    };

    return (
      <div onClick={() => archiveClick(result)} className="list__cell__link">
        <span>{result.archived ? 'Unarchive' : 'Archive'}</span>
      </div>
    );
  };

  link.propTypes = {
    value: PropTypes.string,
    row: PropTypes.object,
  };

  return link;
};

ArchiveLink.propTypes = {
  action: PropTypes.func,
  loggedInUser: PropTypes.string,
};

export default ArchiveLink;
