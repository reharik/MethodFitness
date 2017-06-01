import React from 'react';
import PropTypes from 'prop-types';
import {noop, identity} from 'lodash';

export default class Option extends React.Component {

  static displayName = 'Option';

  static propTypes = {
    selected: PropTypes.bool,
    index: PropTypes.number,
    handleSelect: PropTypes.func,
    handleClick: PropTypes.func,
    parse: PropTypes.func,
    filter: PropTypes.string
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
        onMouseEnter={this.onMouseEnter} dangerouslySetInnerHTML={final} />
    );
  }
}
