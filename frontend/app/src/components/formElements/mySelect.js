import React from 'react';
import PropTypes from 'prop-types';
import RcSelect from 'select';
import classNames from 'classnames';
// import warning from '../_util/warning';

// => It is needless to export the declaration of below two inner components.
// export { Option, OptGroup };

export default class Select extends React.Component {
  // static Option = Option as React.ClassicComponentClass;
  // static OptGroup = OptGroup as React.ClassicComponentClass;

  componentDidMount() {
    if (this.props.autoFocus) {
      console.log(`==========this.input=========`);
      console.log(this.input);
      console.log(this.input.getInputDOMNode());
      console.log(this.input.getDropdownContainer());
      console.log(`==========END this.input=========`);
      this.input.tabindex = 0;
      this.input.inputInstance.focus();
    }
  }
  static defaultProps = {
    prefixCls: 'ant-select',
    showSearch: false,
    transitionName: 'slide-up',
    choiceTransitionName: 'zoom'
  };

  static propTypes = {
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    size: PropTypes.oneOf(['default', 'large', 'small']),
    combobox: PropTypes.bool,
    notFoundContent: PropTypes.any,
    showSearch: PropTypes.bool,
    optionLabelProp: PropTypes.string,
    transitionName: PropTypes.string,
    choiceTransitionName: PropTypes.string,
    mode: PropTypes.string,
    multiple: PropTypes.bool,
    tags: PropTypes.bool,
    autoFocus: PropTypes.bool
  };

  static contextTypes = {
    antLocale: PropTypes.object
  };

  getLocale() {
    const { antLocale } = this.context;
    if (antLocale && antLocale.Select) {
      return antLocale.Select;
    }
    return {
      notFoundContent: '无匹配结果'
    };
  }

  render() {
    const {
      prefixCls,
      className = '',
      size,
      mode,
      // @deprecated
      multiple,
      tags,
      combobox,
      ...restProps
    } = this.props;

    const cls = classNames({
      [`${prefixCls}-lg`]: size === 'large',
      [`${prefixCls}-sm`]: size === 'small'
    }, className);

    const locale = this.getLocale();
    let { notFoundContent = locale.notFoundContent, optionLabelProp } = this.props;
    const isCombobox = mode === 'combobox' || combobox;
    if (isCombobox) {
      notFoundContent = null;
      // children 带 dom 结构时，无法填入输入框
      optionLabelProp = optionLabelProp || 'value';
    }

    const modeConfig = {
      multiple: mode === 'multiple' || multiple,
      tags: mode === 'tags' || tags,
      combobox: isCombobox
    };

    // console.log(`==========this.props.autoFocus=========`);
    // console.log(this.props.autoFocus);
    // console.log(`==========END this.props.autoFocus=========`);
    const refFocus = input => {
      this.input = input;
    };
    return (
      <RcSelect
        ref={refFocus}
        {...restProps}
        {...modeConfig}
        prefixCls={prefixCls}
        className={cls}
        optionLabelProp={optionLabelProp || 'children'}
        notFoundContent={notFoundContent}
      />
    );
  }
}
