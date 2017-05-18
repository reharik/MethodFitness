import React, {PropTypes} from 'react';

const NavBreadCrumbItem = ({text, position, onClick}) => {
  if (position !== 'last') {
    return (<li className="menu__breadcrumb__list__item">
      <a className="menu__breadcrumb__list__item__link" onClick={onClick}>{text}</a>
      <div className="menu__breadcrumb__list__item__icon"></div>
    </li>);
  }
  return null;
};
  export default NavBreadCrumbItem;
