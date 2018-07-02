import React from 'react';
import PropTypes from 'prop-types';

const EmailLink = value => {
  return (
    <div>
      <a href={'mailto:' + value}>{value}</a>
    </div>
  );
};

EmailLink.propTypes = {
  column: PropTypes.object,
  row: PropTypes.object,
};

export default EmailLink;
