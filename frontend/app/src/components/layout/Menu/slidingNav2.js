// let React = require('react');
// let ReactDom = require('react-dom');
// const CSSTransitionGroup = require('react-addons-css-transition-group');
//
// const SlideTransition = React.createClass({
//   propTypes: {
//     depth: React.PropTypes.number.isRequired,
//     name: React.PropTypes.string
//   },
//   getDefaultProps() {
//     return {
//       name: 'slider'
//     };
//   },
//   getInitialState() {
//     return { direction: 'right' };
//   },
//   componentWillReceiveProps(newProps) {
//     const direction = newProps.depth > this.props.depth ? 'right' : 'left';
//     this.setState({ direction });
//   },
//   render() {
//     const { name, depth } = this.props;
//     const outerProps = {
//       className: `${name}-outer-wrapper ${this.props.className}`
//     };
//     const transProps = {
//       component: 'div',
//       transitionName: `${name}-${this.state.direction}`,
//       className: `${name}-transition-group`
//     };
//     const innerProps = {
//       ref: 'inner',
//       key: depth,
//       className: `${name}-inner-wrapper`
//     };
//
//     return (
//       <div {...this.props} {...outerProps}>
//         <CSSTransitionGroup {...transProps}>
//           <div {...innerProps}>
//             {this.props.children}
//           </div>
//         </CSSTransitionGroup>
//       </div>
//     );
//   }
// });
//
// const Browser = React.createClass({
//   getInitialState() {
//     return {
//       path: [],
//       breadCrumbs: []
//     };
//   },
//   navUp() {
//     this.setState({ path: this.state.path.slice(0, -1) });
//     this.setState({ breadCrumbs: this.state.breadCrumbs.slice(0, -1) });
//   },
//   navDown(index) {
//     let path = this.state.path.concat(index);
//     this.setState({ path });
//   },
//   navTo(breadCrumb) {
//     this.setState({ path: this.state.path.slice(0, breadCrumb.index) });
//     this.setState({ breadCrumbs: this.state.breadCrumbs.slice(0, breadCrumb.index) });
//   },
//   goTo(item) {
//     console.log(item.name);
//   },
//   render() {
//     const options = this.props.options;
//     let { path, breadCrumbs } = this.state;
//     const items = path.reduce(
//       function(items, key, index) {
//         let item = items[key];
//         let items2 = {
//           name: item.name,
//           index
//         };
//         console.log('==========item2=========');
//         console.log(items2);
//         console.log('==========ENDitem2=========');
//         breadCrumbs = breadCrumbs.concat(items2);
//         console.log('==========breadCrumbs=========');
//         console.log(breadCrumbs);
//         console.log('==========ENDbreadCrumbs=========');
//         return item.children;
//       },
//       this.props.items
//     );
//
//     let breadCrumbComp = (
//       <ul className="fg-menu-breadcrumb fg-menu-footer ui-widget-header ui-corner-all ui-helper-clearfix">
//         {breadCrumbs.map(
//           function(item) {
//             return <li className="fg-menu-breadcrumb-text"><a onClick={e => this.navTo(item)}>{item.name}</a></li>;
//           }.bind(this)
//         )}
//       </ul>
//     );
//
//     return (
//       <div className="mf_menuContainer ui-widget ui-widget-content ui-corner-all">
//         {path.length > 0 ? breadCrumbComp : null}
//         <SlideTransition depth={path.length} className="items-container">
//           <ul className="ui-corner-all ui-widget-content fg-menu-current">
//             {items.map(
//               function(item, index) {
//                 if (item.children) {
//                   return (
//                     <li>
//                       <a rel="calendar" className="ui-corner-all" onClick={e => this.navDown(index)}>{item.name}</a>
//                     </li>
//                   );
//                 } else {
//                   return (
//                     <li>
//                       <a rel="calendar" className="ui-corner-all" onClick={e => this.goTo(item)}>{item.name}</a>
//                     </li>
//                   );
//                 }
//               }.bind(this)
//             )}
//           </ul>
//         </SlideTransition>
//       </div>
//     );
//   }
// });
//
// module.exports = Browser;
// //
// //ReactDom.render(<Browser items={data} />, document.body);
