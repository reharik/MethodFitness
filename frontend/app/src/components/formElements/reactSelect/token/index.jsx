import React from 'react';
import PropTypes from 'prop-types';
import {identity, noop} from 'lodash';

export default class Token extends React.Component {

  static displayName = 'Token';

  static propTypes = {
    handleRemove: PropTypes.func,
    index: PropTypes.number,
    parse: PropTypes.func
  }

  static defaultProps = {
    handleRemove: noop,
    parse: identity,
    index: 0,
    fullWidth: false
  }

  state = {
  }

  onRemoveBtnClick = () => {
    this.props.handleRemove(this.props.index);
  }

  parseLabel = value => {

  }

  renderRemoveBtn = () => {
    return (
      <div
        ref="removeBtn"
        className="reactSelect__token__removeBtn  token-remove-btn"
        onClick={this.onRemoveBtnClick}>
        x
      </div>
    );
  }

  render() {
    const className = `reactSelect__token__wrapper ${this.props.fullWidth?'reactSelect__token__wrapperFullWidth':''}`;
    return (
      <div ref="wrapper" className={className} >
        <div ref="value" className="reactSelect__token__value" >
          { this.props.parse(this.props.value) }
        </div>
        { !this.props.fullWidth ? this.renderRemoveBtn() : null}
      </div>
    );
  }
}
