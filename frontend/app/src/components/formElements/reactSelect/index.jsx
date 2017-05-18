import React from 'react';
import ReactDOM from 'react-dom';
import OptionList from './options/index.jsx';
import Token from './token/index.jsx';
import {includes, differenceWith, filter, noop, identity, isArray, isUndefined, isEmpty} from 'lodash';
import {contains} from 'underscore.string';
import keyCodes from './utils/keyCodes';


class TokenAutocomplete extends React.Component {

  static displayName = 'TokenAutocomplete';

  static propTypes = {
    //initial state
    options: React.PropTypes.array,
    placeholder: React.PropTypes.string,
    // treshold: tresholdPropType,
    // defaultValues: defaultValuesPropType,
    processing: React.PropTypes.bool,
    focus: React.PropTypes.bool,
    //behaviour
    filterOptions: React.PropTypes.bool,
    simulateSelect: React.PropTypes.bool,
    limitToOptions: React.PropTypes.bool,
    parseOption: React.PropTypes.func,
    parseToken: React.PropTypes.func,
    parseCustom: React.PropTypes.func,
    //handles
    onInputChange: React.PropTypes.func,
    onChange: React.PropTypes.func
  }

  static defaultProps = {
    //initial state
    options: [],
    defaultValues: [],
    placeholder: 'add new tag',
    treshold: 0,
    focus: false,
    processing: false,
    //behaviour
    filterOptions: true,
    simulateSelect: false,
    limitToOptions: false,
    parseOption: identity,
    parseToken: identity,
    parseCustom: identity,
    //handles
    onInputChange: noop,
    onChange: noop
  }

  state = {
    focused: false,
    inputValue: '',
    values: []
  }


  //LIFECYCLE

  componentDidMount() {
    let values = this.props.defaultValues;
    values = isArray(values) ? values : [values];
    this.setState({values});

    if (!isUndefined(this.props.focus)) {
      this.setState({focused: this.props.focus});
    }

    if (this.props.focus) {
      this.bindListeners();
    }

    if (window) {
      window.addEventListener('click', this.handleClick);
    }

  }
  componentWillReceiveProps(nextProps) {
    let values = nextProps.defaultValues;
    values = isArray(values) ? values : [values];
    this.setState({values});
  }

  componentWillUnmount() {
    if (window) {
      window.removeEventListener('click', this.handleClick);
    }
  }

  bindListeners() {
    if (!this.keyDownListener) {
      this.keyDownListener = window.addEventListener('keydown', this.onKeyDown);
    }
  }

  unbindListeners() {
    window.removeEventListener('keydown', this.onKeyDown);
    delete this.keyDownListener;
  }

  //EVENT HANDLERS

  onInputChange = e => {
    this.props.onInputChange(e.target.value);
    this.setState({
      inputValue: e.target.value
    });
  };

  onKeyDown = e => {
    switch (e.keyCode) {
      case keyCodes.ESC:
        this.blur();
        break;
      case keyCodes.TAB:
      case keyCodes.ENTER:
        this.addSelectedValue(this.refs.options.getSelected());
        e.preventDefault();
        break;
      case keyCodes.BACKSPACE:
        if (!this.state.inputValue.length) {
          this.setState({
            inputValue: this.state.inputValue.slice(0, -1)
          });
          this.deleteValue(this.state.values.size - 1);
          e.preventDefault();
        }
        break;
    }
  };

  handleClick = e => {
    const clickedOutside = !ReactDOM.findDOMNode(this).contains(e.target);
     if (clickedOutside && this.state.focused) {
        this.blur();
     }

     if (!clickedOutside && !this.state.focused) {
       this.focus();
     }
   }

  //ACTIONS

  focus = () => {
    if (this.refs.input) {
      ReactDOM.findDOMNode(this.refs.input).focus();
    }
    this.bindListeners();
    this.setState({focused: true});
  };

  blur = () => {
    if (this.refs.input) {
      ReactDOM.findDOMNode(this.refs.input).blur();
    }

    this.unbindListeners();
    this.setState({focused: false});
  };

  deleteValue = (index) => {
    const valueRemoved = this.state.values.splice(index,1);
    const stateValues = this.state.values;
    const fieldValues = this.state.values.map(x=>x.value);
    this.props.onChange({target:{name:this.props.name, value:fieldValues}}, stateValues, valueRemoved);

    this.setState({stateValues});
    this.focus();
  };

  addSelectedValue = (value) => {
    const areOptionsAvailable = this.getAvailableOptions().length;
    const newValue = areOptionsAvailable ? value : void 0;
    const isAlreadySelected = includes(this.state.values, newValue);
    const shouldAddValue = !!newValue && !isAlreadySelected;

    let stateValues;
    if (shouldAddValue) {
      let fieldValues;
      if(this.props.simulateSelect) {

        stateValues = newValue;
        fieldValues = newValue.value;
      } else {
        // must be better way to do this.  maybe splice
        this.state.values.push(newValue);
        stateValues = this.state.values;
        fieldValues = this.state.values.map(x=>x.value);
      }

      this.props.onChange({target:{ name:this.props.name, value:fieldValues}}, stateValues, newValue);
    }

      let valueArray = isArray(stateValues) ? stateValues: [stateValues];
      if(!stateValues){
        valueArray = [];
      }
      this.setState({
        values: valueArray,
        inputValue: ''
      });

      this.blur();
  };

  //HELPERS

  getAvailableOptions = () => {
    let availableOptions = [];

    if (this.isTresholdReached()) {
      //notselected if not simulating select
      if (this.props.simulateSelect) {
        availableOptions = this.props.options;
      } else {
        availableOptions = differenceWith(this.props.options, this.state.values, (x,y) => x.value === y.value );
      }
      //filter
      availableOptions = filter(availableOptions, option => {
        return contains(option.display.toLowerCase(), this.state.inputValue.toLowerCase())
// this matches on value too which is good for states, not really for anything else
          || contains(option.value.toLowerCase(), this.state.inputValue.toLowerCase());
      })
        .map(x=> ({...x, filter:this.state.inputValue}));

    }
    return availableOptions;
  }

  shouldShowOptions = () => {
    return this.isTresholdReached() && this.state.focused;
  }

  shouldShowHiddenInput = () => {
    return this.props.simulateSelect && this.state.values.length > 0;
  };

  isTresholdReached = () => {
    return this.state.inputValue.length >= this.props.treshold;
  }

  //RENDERERS

  renderOptionsDropdown = () => {
    if (this.shouldShowOptions()) {
      let passProps = {
          options: this.getAvailableOptions(),
          term: this.state.inputValue,
          handleAddSelected: this.addSelectedValue,
          parseOption: this.props.parseOption
      };
      return <OptionList ref="options" {...passProps}/>;
    } else {
      return null;
    }
  }

  renderTokens = () => {
    return this.state.values.map((value, key) => {
      return (
        <Token
          key={key}
          ref={'token' + key}
          index={key}
          value={value}
          fullWidth={this.props.simulateSelect}
          parse={this.props.parseToken}
          handleRemove={this.deleteValue}/>
      );
    });
  };

  renderProcessing = () => {
    return this.props.processing ? <div ref="processing" className="reactSelect__processing" /> : null;
  };

  renderInput = () =>
      (<input
          onFocus={this.focus}
          onChange={this.onInputChange}
          value={this.state.inputValue}
          placeholder={this.props.placeholder}
          className={ this.shouldShowHiddenInput() ? "reactSelect__hiddenInput" : "reactSelect__input" }
          ref="input"/>);

  renderDropdownIndicator = () => {
    return
    // this.props.simulateSelect
    (<div ref="dropdownIndicator" className="reactSelect__dropdownIndicator" />)
  //     : null;
  };

  render() {
    return (
      <div ref="wrapper" className="reactSelect__wrapper" >
        {this.renderTokens()}
        <div ref="inputWrapper" className="reactSelect__inputWrapper" onClick={this.focus} >
          {this.renderInput()}
          {this.renderProcessing()}
          {this.renderDropdownIndicator()}
        </div>
        {this.renderOptionsDropdown()}
      </div>
    );
  }
}

export default TokenAutocomplete;
