import { Link } from 'react-router';
import React from 'react';
import PropTypes from 'prop-types';

const CellLink = (route, idName = 'id', additionalParams) => {
  const link = (value, row) => {
    const fullRoute = `${route}/${row ? row[idName] : 0}${additionalParams ? `/${additionalParams}` : ''}`;
    return (
      <Link to={fullRoute} className="list__cell__link">
        <span>{value}</span>
      </Link>
    );
  };
  link.propTypes = {
    value: PropTypes.string,
    row: PropTypes.object,
  };

  return link;
};

CellLink.propTypes = {
  route: PropTypes.string,
};

export default CellLink;
