import React from 'react';

const ListItemValueFor = ({ data }) => {
  return (
        <ul className="display__container__value" style={{"width":"50%"}}>
          {data.value.map((x, i) => (
            <li key={i} className="list__item__value" >
              <span>{x.item ? x.item.display : ''}</span>
              <span>{x.value}</span>
            </li>)
          )}
        </ul>
  );
};

export default ListItemValueFor;
