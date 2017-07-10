import React from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';

const ArchiveLink = (action, loggedInUser) => {
  const link = (value, row) => {
    const result = {id: row.id, archived: value};
    const archiveClick = (result) => {
      if (result.id === loggedInUser) {
        message.info('You may not archive the currently logged in User', 3);
        return;
      }
      action(result);
    };

    return (
      <div onClick={() => archiveClick(result)} className="list__cell__link">
        <span>{result.archived ? 'UnArchive' : 'Archive'}</span>
      </div>
    );
  };

  link.propTypes = {
    value: PropTypes.string,
    row: PropTypes.object
  };

  return link;
};

ArchiveLink.propTypes = {
  action: PropTypes.func,
  loggedInUser: PropTypes.string
};

export default ArchiveLink;
