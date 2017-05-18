import React from 'react';
import {noop, identity} from 'lodash';

export default class Option extends React.Component {

  static displayName = 'Option';

  static propTypes = {
    selected: React.PropTypes.bool,
    index: React.PropTypes.number,
    handleSelect: React.PropTypes.func,
    handleClick: React.PropTypes.func,
    parse: React.PropTypes.func,
    filter: React.PropTypes.string
  };

  static defaultProps = {
    handleSelect: noop,
    handleClick: noop,
    selected: false,
    index: 0,
    parse: identity
  };

  onMouseEnter = () => {
    this.props.handleSelect(this.props.index);
  }

  onClick = () => {
    this.props.handleClick(this.props.value);
  }

  render() {
    let className = `reactSelect__options__option__wrapper ${this.props.selected? 'reactSelect__options__option__selected' : ''}`;

    let val = this.props.parse(this.props.value);
    const filter = this.props.filter;
    if(filter) {
      var re = new RegExp(filter,"gi");
      val = val.replace(re, m => `<b>${m}</b>`);
    }
    const final = {__html: val};

    return (
      <div
        ref="wrapper"
        className={ className }
        onClick={this.onClick}
        onMouseEnter={this.onMouseEnter} dangerouslySetInnerHTML={final}>
      </div>
    );
  }
}
