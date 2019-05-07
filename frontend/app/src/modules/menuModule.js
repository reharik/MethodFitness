import { LOGIN } from './authModule';
import selectn from 'selectn';
import getMenuItems from './../utilities/menuItems';

export const NAV_DOWN = 'methodFit/menu/NAV_DOWN';
export const NAV_SELECT = 'methodFit/menu/NAV_SELECT';
export const NAV_TO = 'methodFit/menu/NAV_TO';

//Menu items are imported above from utilities/menuItems
//Menu items are imported above from utilities/menuItems
//Menu items are imported above from utilities/menuItems
//We must pre populate because if there's an f5 we still need the items.
const item = localStorage.getItem('menu_data');
const data = item
  ? JSON.parse(item)
  : {
      //TODO need role to pass to getMenuItems
      menuItems: getMenuItems(),
      path: [],
      breadCrumbItems: ['Home'],
      currentItem: '',
    };

export default (state = data, action = {}) => {
  switch (action.type) {
    case NAV_DOWN: {
      return Object.assign({}, state, {
        path: [...state.path, action.index],
        breadCrumbItems: [...state.breadCrumbItems, action.text],
      });
    }
    case NAV_SELECT: {
      return Object.assign({}, state, {
        currentItem: action.text,
      });
    }
    case NAV_TO: {
      return Object.assign({}, state, {
        path: state.path.slice(0, action.index),
        breadCrumbItems: state.breadCrumbItems.slice(0, action.index + 1),
      });
    }
    case LOGIN.SUCCESS: {
      const role = selectn('response.user.role', action);
      const menuItems = getMenuItems(role);
      const menuData = { ...state, menuItems };
      localStorage.setItem('menu_data', JSON.stringify(menuData));

      return menuData;
    }
    default:
      return state;
  }
};

export const menuItemClicked = (index, text, isParent) => {
  return isParent
    ? {
        type: NAV_DOWN,
        index,
        text,
      }
    : {
        type: NAV_SELECT,
        text,
      };
};

export const navBreadCrumbClicked = index => {
  return {
    type: NAV_TO,
    index,
  };
};
