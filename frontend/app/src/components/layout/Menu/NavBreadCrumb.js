import React from 'react';
import PropTypes from 'prop-types';

import NavBreadCrumbItem from './NavBreadCrumbItem';

const NavBreadCrumb = ({ breadCrumbItems, navBreadCrumbClicked }) => (
  <div className="menu__breadcrumb">
    <ul className="menu__breadcrumb__list">
      {breadCrumbItems.map((item, index) => (
        <NavBreadCrumbItem
          key={index}
          text={item}
          onClick={() => navBreadCrumbClicked(index)}
          position={index === breadCrumbItems.length - 1 ? 'last' : ''}
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

NavBreadCrumb.propTypes = {
  breadCrumbItems: PropTypes.array,
  navBreadCrumbClicked: PropTypes.func
};

export default NavBreadCrumb;
