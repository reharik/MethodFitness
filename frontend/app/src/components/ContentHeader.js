import React from 'react';
import PropTypes from 'prop-types';

const ContentHeader = ({ children }) => (
  <div className="contentHeader">{children} </div>
);

ContentHeader.propTypes = {
  children: PropTypes.object,
};

export default ContentHeader;
