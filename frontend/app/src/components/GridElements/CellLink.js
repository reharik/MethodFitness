/**
 * Created by reharik on 4/16/16.
 */
import {browserHistory} from 'react-router';
import React from 'react';


export default route => {
  return ({value, row}) => {
    const fullRoute = route + '/' + row.id;
    return (
      <div onClick={e=> browserHistory.push(fullRoute)} className="list__cell__link">
        <span>{value}</span>
      </div>);
  };
};
