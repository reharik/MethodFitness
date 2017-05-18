/**
 * Created by reharik on 3/12/16.
 */
import React, { PropTypes } from 'react';
import NavBreadCrumbItem from './NavBreadCrumbItem';

const NavBreadCrumb = ({ breadCrumbItems, navBreadCrumbClicked }) => (
  <div className="menu__breadcrumb">
    <ul className="menu__breadcrumb__list">
      {breadCrumbItems.map((item, index) => (
        <NavBreadCrumbItem
          key={index}
          text={item}
          onClick={() => navBreadCrumbClicked(index)}
          position={index == breadCrumbItems.length - 1 ? 'last' : ''}
        />
      ))}
    </ul>
    <div className="menu__breadcrumb__list__item__last">
      <a className="menu__breadcrumb__list__item__last__link">
        {breadCrumbItems[breadCrumbItems.length - 1]}
      </a>
    </div>
  </div>
);

export default NavBreadCrumb;
