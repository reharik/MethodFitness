/**
 * Created by reharik on 3/8/16.
 */
import React, {PropTypes} from 'react';
import {browserHistory} from 'react-router';

const MenuItem = ({children, text, onClick, path, currentItem}) => {
  const itemClick = (e) => {
    browserHistory.push(path);
    onClick(e)
  };

  if (children && children.length > 0) {
    return (<li className="menu__item__node" onClick={onClick}>
      <a className="menu__item__node__link"  key={text}>
        <div>{text}</div>
        <div className="menu__item__node__link__icon"></div>
      </a></li>);
  }
  let selected = currentItem == text ? 'menu__item__leaf__active' : '';
  return <li className={ 'menu__item__leaf ' + selected} onClick={itemClick}>
    <span className="menu__item__leaf__link" >{text}</span>
  </li>;
};

MenuItem.propTypes = {
  text: PropTypes.string.isRequired
};

export default MenuItem;
