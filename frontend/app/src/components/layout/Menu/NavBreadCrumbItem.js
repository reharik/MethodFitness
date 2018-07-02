import React from 'react';
import PropTypes from 'prop-types';

const NavBreadCrumbItem = ({ text, position, onClick }) => {
  if (position !== 'last') {
    return (
      <li className="menu__breadcrumb__list__item">
        <a className="menu__breadcrumb__list__item__link" onClick={onClick}>
          {text}
        </a>
        <div className="menu__breadcrumb__list__item__icon" />
      </li>
    );
  }
  return null;
};

NavBreadCrumbItem.propTypes = {
  text: PropTypes.string,
  position: PropTypes.string,
  onClick: PropTypes.func,
};

export default NavBreadCrumbItem;
