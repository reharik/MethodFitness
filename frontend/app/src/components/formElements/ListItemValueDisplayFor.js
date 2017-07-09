import React from 'react';
import PropTypes from 'prop-types';

const ListItemValueDisplayFor = ({ data }) => {
  return (
    <ul className="display__container__value" >
      {data.value.map((x, i) => (
        <li key={i} className="list__item__value">
          <span>{x.item ? x.item.display : ''}</span>
          <span>{x.value}</span>
        </li>)
      )}
    </ul>
  );
};

ListItemValueDisplayFor.propTypes = {
  data: PropTypes.object
};

export default ListItemValueDisplayFor;
