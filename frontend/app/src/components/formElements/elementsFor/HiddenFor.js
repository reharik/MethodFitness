import React from 'react';
import PropTypes from 'prop-types';

const Hidden = ({ data }) => {
  return <input name={data.name} value={data.value} type="hidden" />;
};

Hidden.propTypes = {
  data: PropTypes.object
};

export default Hidden;
