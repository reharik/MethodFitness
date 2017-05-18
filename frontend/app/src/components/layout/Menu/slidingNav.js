let React = require('react');
let ReactDom = require('react-dom');
const CSSTransitionGroup = require('react-addons-css-transition-group');

const SlideTransition = React.createClass({
  propTypes: {
    depth: React.PropTypes.number.isRequired,
    name: React.PropTypes.string
  },
  getDefaultProps() {
    return {
      name: 'slider'
    };
  },
  getInitialState() {
    return {direction: 'right'};
  },
  componentWillReceiveProps(newProps) {
    const direction = newProps.depth > this.props.depth ? 'right' : 'left';
    this.setState({direction});
  },
  render() {
    const {name, depth} = this.props;
    const outerProps = {
      className: `${name}-outer-wrapper ${this.props.className}`
    };
    const transProps = {
      component: 'div',
      transitionName: `${name}-${this.state.direction}`,
      className: `${name}-transition-group`
    };
    const innerProps = {
      ref: 'inner',
      key: depth,
      className: `${name}-inner-wrapper`
    };

    return (<div {...this.props} {...outerProps}>
      <CSSTransitionGroup {...transProps}>
        <div {...innerProps}>
          {this.props.children}
        </div>
      </CSSTransitionGroup>
    </div>);
  }
});

const Browser = React.createClass({
  getInitialState() {
    return {
      path: []
    };
  },
  navUp() {
    this.setState({path: this.state.path.slice(0, -1)});
  },
  navDown(index) {
    let path = this.state.path.concat(index);
    this.setState({path});
  },
  render() {

    const {path} = this.state;
    const items = path.reduce(function (items, key) {
      return items[key].children;
    }, this.props.items);
    return (<div className="browser">
      <h3>{path.length > 0 ? <a onClick={this.navUp}>← Back</a> : 'Home'}</h3>

      <SlideTransition depth={path.length} className="items-container">
        <ul>
          {items.map(function (item, index) {
            if (item.children) {
              return <li className="item"><a onClick={e => this.navDown(index)} key={item.name}>{item.name}</a></li>;
            } else {
              return <li className="item">
                <div key={item.name}>{item.name}</div>
              </li>;
            }
          }.bind(this))}
        </ul>
      </SlideTransition>

    </div>);
  }
});

module.exports = Browser;
//
//ReactDom.render(<Browser items={data} />, document.body);
