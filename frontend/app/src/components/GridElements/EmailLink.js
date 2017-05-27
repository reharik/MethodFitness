import React from 'react';
import PropTypes from 'prop-types';
import selectn from 'selectn';

const EmailLink = ({ column, row }) => {
  const value = selectn(column.propertyName, row);
  return (
    <div>
      <a href={'mailto:' + value}>{value}</a>
    </div>
  );
};

EmailLink.propTypes = {
  column: PropTypes.object,
  row: PropTypes.object
};

export default EmailLink;
