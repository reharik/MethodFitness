import React, { PropTypes } from 'react';
import NavBreadCrumb from './NavBreadCrumb';
import MenuItem from './MenuItem';

const MenuItemList = ({ items, breadCrumbItems, path, currentItem, menuItemClicked, navBreadCrumbClicked }) => {
  if (!items) {
    return null;
  }
  return (
    <div className="menu">
      {path.length > 0
        ? <NavBreadCrumb breadCrumbItems={breadCrumbItems} navBreadCrumbClicked={navBreadCrumbClicked} />
        : null}
      <ul className="menu__items">
        {items.map((item, index) => (
          <MenuItem
            key={index}
            {...item}
            currentItem={currentItem}
            onClick={() => menuItemClicked(index, item.text, !!item.children)}
          />
        ))}
      </ul>
    </div>
  );
};

export default MenuItemList;
