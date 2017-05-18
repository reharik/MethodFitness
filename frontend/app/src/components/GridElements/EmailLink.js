/**
 * Created by reharik on 4/16/16.
 */
import React from 'react';
import selectn from 'selectn';

export default ({ column, row }) => {
  const value = selectn(column.propertyName, row);
  return (
    <div>
      <a href={'mailto:' + value}>{value}</a>
    </div>
  );
};
