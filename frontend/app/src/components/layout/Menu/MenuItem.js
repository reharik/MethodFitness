import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const MenuItem = ({ history, children, text, onClick, path, currentItem }) => {
  const itemClick = e => {
    history.push(path);
    onClick(e);
  };

  if (children && children.length > 0) {
    return (
      <li className="menu__item__node" onClick={onClick}>
        <a className="menu__item__node__link" key={text}>
          <div>{text}</div>
          <div className="menu__item__node__link__icon" />
        </a>
      </li>
    );
  }
  let selected = currentItem === text ? 'menu__item__leaf__active' : '';
  return (
    <li className={'menu__item__leaf ' + selected} onClick={itemClick}>
      <span className="menu__item__leaf__link">{text}</span>
    </li>
  );
};

MenuItem.propTypes = {
  children: PropTypes.array,
  onClick: PropTypes.func,
  path: PropTypes.string,
  currentItem: PropTypes.string,
  text: PropTypes.string.isRequired,
  history: PropTypes.object
};

export default withRouter(MenuItem);
