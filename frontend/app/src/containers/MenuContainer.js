import { connect } from 'react-redux';
import { menuItemClicked, navBreadCrumbClicked } from './../modules/index.js';
import MenuItemList from '../components/layout/Menu/MenuItemList';

function getCurrentItems(items, path) {
  return path.reduce(
    function(i, key) {
      return i[key].children;
    },
    items
  );
}

function mapStateToProps(state, props) {
  return {
    items: getCurrentItems(state.menu.menuItems, state.menu.path),
    path: state.menu.path,
    breadCrumbItems: state.menu.breadCrumbItems,
    currentItem: state.menu.currentItem
  };
}

export default connect(mapStateToProps, { menuItemClicked, navBreadCrumbClicked })(MenuItemList);
