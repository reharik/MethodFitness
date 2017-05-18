import React from 'react';
import styles from './styles.css';
import {identity, noop} from 'lodash';

export default class Token extends React.Component {

  static displayName = 'Token';

  static propTypes = {
    handleRemove: React.PropTypes.func,
    index: React.PropTypes.number,
    parse: React.PropTypes.func
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
        style={this.props.style.removeBtn}
        className={ styles.removeBtn + ' token-remove-btn' }
        onClick={this.onRemoveBtnClick}>
        x
      </div>
    );
  }

  render() {

    const {style} = this.props;

    return (
      <div className={ styles.wrapper } style={[style.wrapper, this.props.fullWidth && style.wrapperFullWidth]}>
        <div className={ styles.value } style={style.value}>
          { this.props.parse(this.props.value) }
        </div>
        { !this.props.fullWidth ? this.renderRemoveBtn() : null}
      </div>
    );
  }
}
