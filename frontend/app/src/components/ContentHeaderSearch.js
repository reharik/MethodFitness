import React from 'react';
import PropTypes from 'prop-types';

const ContentHeaderSearch = ({ search }) => (
  <input className="contentHeader__headerSearch" onChange={search} />
);

ContentHeaderSearch.propTypes = {
  search: PropTypes.func,
};

export default ContentHeaderSearch;
