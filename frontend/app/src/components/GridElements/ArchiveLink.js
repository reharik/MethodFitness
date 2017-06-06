import React from 'react';
import PropTypes from 'prop-types';

const ArchiveLink = action => {
  const link = (value, row) => {
    const result = { id: row.id, archived: value };

    return (
      <div onClick={() => action(result)} className="list__cell__link">
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
  action: PropTypes.func
};

export default ArchiveLink;
