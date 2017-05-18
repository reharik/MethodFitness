import React from 'react';

export default action => {
  return ({ value, row }) => {
    let archived = true;
    if (!value || value == 'undefined' || value === 'false') {
      archived = false;
    }
    const result = { id: row.id, archived };

    return (
      <div onClick={e => action(result)} className="list__cell__link">
        <span>{result.archived ? 'UnArchive' : 'Archive'}</span>
      </div>
    );
  };
};
