(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["freakin-react-forms"] = factory(require("react"));
	else
		root["freakin-react-forms"] = factory(root["react"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Form = __webpack_require__(2);

	Object.defineProperty(exports, 'Form', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_Form).default;
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	;

	var _temp = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }
	}();

	;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	var _validationRunner = __webpack_require__(4);

	var _validationRunner2 = _interopRequireDefault(_validationRunner);

	var _normalizeModel = __webpack_require__(7);

	var _normalizeModel2 = _interopRequireDefault(_normalizeModel);

	var _decorateInputs = __webpack_require__(10);

	var _decorateInputs2 = _interopRequireDefault(_decorateInputs);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Form = function (_React$Component) {
	  _inherits(Form, _React$Component);

	  function Form() {
	    var _ref;

	    var _temp, _this, _ret;

	    _classCallCheck(this, Form);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Form.__proto__ || Object.getPrototypeOf(Form)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
	      formIsValid: true
	    }, _this.handleChange = function () {
	      var _this2;

	      return (_this2 = _this).__handleChange__REACT_HOT_LOADER__.apply(_this2, arguments);
	    }, _this.generateNameValueModel = function () {
	      var _this3;

	      return (_this3 = _this).__generateNameValueModel__REACT_HOT_LOADER__.apply(_this3, arguments);
	    }, _this.onChangeHandler = function () {
	      var _this4;

	      return (_this4 = _this).__onChangeHandler__REACT_HOT_LOADER__.apply(_this4, arguments);
	    }, _this.onBlurHandler = function () {
	      var _this5;

	      return (_this5 = _this).__onBlurHandler__REACT_HOT_LOADER__.apply(_this5, arguments);
	    }, _this.onSubmitHandler = function () {
	      var _this6;

	      return (_this6 = _this).__onSubmitHandler__REACT_HOT_LOADER__.apply(_this6, arguments);
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  _createClass(Form, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      var eventHandler = { onChangeHandler: this.onChangeHandler, onBlurHandler: this.onBlurHandler };
	      var fields = (0, _normalizeModel2.default)(this.props, eventHandler);
	      this.setState({ fields: fields });
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(newProps) {
	      var model = newProps.model;
	      var fields = this.state.fields;
	      var newFields = Object.keys(fields).map(function (x) {
	        var field = fields[x];
	        if (!field.dirty || newProps.reset) {
	          var value = model[x].value || '';
	          if (model[x].type === 'array' && value === '') {
	            value = [];
	          }
	          field.value = value;
	        }
	        if (newProps.reset) {
	          field.errors = [];
	        }
	        return field;
	      }).reduce(function (x, y) {
	        x[y.name] = y;return x;
	      }, {});
	      this.setState({ fields: newFields });
	    }
	  }, {
	    key: '__handleChange__REACT_HOT_LOADER__',
	    value: function __handleChange__REACT_HOT_LOADER__(fieldName, value, change) {
	      var fields = this.state.fields;
	      var field = fields[Object.keys(fields).filter(function (x) {
	        return fields[x].name === fieldName;
	      })[0]];
	      if (!field) {
	        return;
	      }
	      if (change) {
	        field.dirty = field.value !== value;
	        field.value = value;
	      }
	      field.errors = (0, _validationRunner2.default)(field, fields);

	      field.invalid = field.errors.length > 0;
	      this.setState({
	        fields: Object.keys(fields).map(function (x) {
	          return fields[x].name === fieldName ? field : fields[x];
	        }).reduce(function (x, y) {
	          x[y.name] = y;return x;
	        }, {}),
	        formIsValid: Object.keys(fields).some(function (f) {
	          return fields[f].errors && fields[f].errors.length > 0;
	        })
	      });
	    }
	  }, {
	    key: '__generateNameValueModel__REACT_HOT_LOADER__',
	    value: function __generateNameValueModel__REACT_HOT_LOADER__() {
	      var fields = this.state.fields;
	      return Object.keys(fields).reduce(function (x, y) {
	        x[y] = fields[y].value;return x;
	      }, {});
	    }
	  }, {
	    key: '__onChangeHandler__REACT_HOT_LOADER__',
	    value: function __onChangeHandler__REACT_HOT_LOADER__(e) {
	      return e.target ? this.handleChange(e.target.name, e.target.value, true) : null;
	    }
	  }, {
	    key: '__onBlurHandler__REACT_HOT_LOADER__',
	    value: function __onBlurHandler__REACT_HOT_LOADER__(e) {
	      return e.target ? this.handleChange(e.target.name, e.target.value) : null;
	    }
	  }, {
	    key: '__onSubmitHandler__REACT_HOT_LOADER__',
	    value: function __onSubmitHandler__REACT_HOT_LOADER__(e) {
	      var _this7 = this;

	      e.preventDefault();
	      this.errors = [];
	      var fields = this.state.fields;
	      var newFieldsState = Object.keys(fields).map(function (x) {
	        fields[x].errors = (0, _validationRunner2.default)(fields[x], _this7.state.fields);
	        _this7.errors = _this7.errors.concat(fields[x].errors);
	        return fields[x];
	      }).reduce(function (x, y) {
	        x[y.name] = y;return x;
	      }, {});

	      this.setState({ fields: newFieldsState, formIsValid: this.errors.length <= 0, errors: this.errors });
	      if (this.errors.length <= 0) {
	        this.props.submitHandler(this.generateNameValueModel());
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      // I have moved this down to render, as it is necessary when using "connect"ed inputs from redux
	      // also superficial evidence is that it does not affect the number of time decorate is called
	      this.newChildren = (0, _decorateInputs2.default)(this.props.children, this.state.fields);
	      return _react2.default.createElement(
	        'form',
	        { onSubmit: this.onSubmitHandler },
	        this.newChildren
	      );
	    }
	  }]);

	  return Form;
	}(_react2.default.Component);

	Form.propTypes = {
	  children: _react.PropTypes.array,
	  submitHandler: _react.PropTypes.func
	};

	var _default = Form;
	exports.default = _default;
	;

	var _temp2 = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }

	  __REACT_HOT_LOADER__.register(Form, 'Form', '/home/rharik/Development/cannibal/freakin-react-forms/src/components/Form.js');

	  __REACT_HOT_LOADER__.register(_default, 'default', '/home/rharik/Development/cannibal/freakin-react-forms/src/components/Form.js');
	}();

	;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _errorMessages = __webpack_require__(5);

	var _errorMessages2 = _interopRequireDefault(_errorMessages);

	var _validationRules = __webpack_require__(6);

	var _validationRules2 = _interopRequireDefault(_validationRules);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var _default = function _default(field, fields) {
	  var _valid = [];
	  if (!field) {
	    throw new Error('You must provide a field to validate');
	  }
	  if (!field.rules || field.rules.length <= 0) {
	    return _valid;
	  }
	  if (!Array.isArray(field.rules)) {
	    field.rules = [field.rules];
	  }
	  if (!field.value && !field.rules.some(function (item) {
	    return item.rule.toLowerCase() === 'required';
	  })) {
	    return _valid;
	  }
	  return field.rules.filter(function (rule) {
	    return !_validationRules2.default[rule.rule](field, rule, fields);
	  }).map(function (rule) {
	    return {
	      formName: field.formName,
	      fieldName: field.name,
	      message: (0, _errorMessages2.default)(field.label, field.value, rule),
	      rule: rule.rule
	    };
	  });
	};

	exports.default = _default;
	;

	var _temp = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }

	  __REACT_HOT_LOADER__.register(_default, 'default', '/home/rharik/Development/cannibal/freakin-react-forms/src/helpers/validation/validationRunner.js');
	}();

	;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _default = function _default(fieldName, value, rule) {
	  var messages = {
	    required: "field '" + fieldName + "' is Required",
	    minlength: "field '" + fieldName + "' should be a minimum of '" + rule.minLength + "'",
	    maxlength: "field '" + fieldName + "' should be a certain maximum of '" + rule.maxLength + "'",
	    rangelength: "field '" + fieldName + "' should be a minimum of '" + rule.minLength + "' and a maximum of '" + rule.maxLength + "'",
	    email: "field '" + fieldName + "' should be valid email",
	    url: "field '" + fieldName + "' should be valid url",
	    date: "field '" + fieldName + "' should be a valid date",
	    number: "field '" + fieldName + "' should be a number",
	    digits: "field '" + fieldName + "' should be didgets",
	    creditcard: "field '" + fieldName + "' should be a valid creditcard",
	    equalTo: "field '" + fieldName + "' should be equal to '" + rule.compareField + "'"
	  };
	  return messages[rule.rule];
	};

	exports.default = _default;
	;

	var _temp = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }

	  __REACT_HOT_LOADER__.register(_default, "default", "/home/rharik/Development/cannibal/freakin-react-forms/src/helpers/validation/errorMessages.js");
	}();

	;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var _default = {
	  required: function required(field) {
	    if (field.type === 'select' || field.type === 'multiselect') {
	      // could be an array for select-multiple or a string, both are fine this way
	      return field.value && field.value.length > 0;
	    }
	    return field.value && field.value.trim().length > 0;
	  },
	  minlength: function minlength(field, rule) {
	    return field.value && field.value.length >= rule.minLength;
	  },


	  // http://docs.jquery.com/Plugins/Validation/Methods/maxlength
	  maxlength: function maxlength(field, rule) {
	    return field.value && field.value.length <= rule.maxLength;
	  },


	  // http://docs.jquery.com/Plugins/Validation/Methods/rangelength
	  rangelength: function rangelength(field, rule) {
	    if (!field.value) {
	      return false;
	    }
	    var length = field.value.length;
	    return length >= rule.minLength && length <= rule.maxLength;
	  },


	  // http://docs.jquery.com/Plugins/Validation/Methods/email
	  email: function email(field) {
	    // contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
	    // eslint-disable-next-line max-len, no-control-regex
	    return (/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(field.value)
	    );
	  },


	  // http://docs.jquery.com/Plugins/Validation/Methods/url
	  url: function url(field) {
	    // contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
	    // eslint-disable-next-line max-len, no-control-regex
	    return (/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(field.value)
	    );
	  },


	  // http://docs.jquery.com/Plugins/Validation/Methods/date
	  date: function date(field) {
	    return !/Invalid|NaN/.test(new Date(field.value));
	  },


	  // http://docs.jquery.com/Plugins/Validation/Methods/number
	  number: function number(field) {
	    // eslint-disable-next-no-control-regex
	    return (/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(field.value)
	    );
	  },


	  // http://docs.jquery.com/Plugins/Validation/Methods/digits
	  digits: function digits(field) {
	    // eslint-disable-next-no-control-regex
	    return (/^\d+$/.test(field.value)
	    );
	  },


	  // http://docs.jquery.com/Plugins/Validation/Methods/creditcard
	  // based on http://en.wikipedia.org/wiki/Luhn
	  creditcard: function creditcard(field) {
	    // accept only spaces, digits and dashes
	    if (/[^0-9 -]+/.test(field.value)) {
	      return false;
	    }
	    var nCheck = 0;
	    var nDigit = 0;
	    var bEven = false;

	    var _value = field.value.replace(/\D/g, '');

	    for (var n = _value.length - 1; n >= 0; n--) {
	      var cDigit = _value.charAt(n);
	      nDigit = parseInt(cDigit, 10);
	      if (bEven) {
	        if ((nDigit *= 2) > 9) {
	          nDigit -= 9;
	        }
	      }
	      nCheck += nDigit;
	      bEven = !bEven;
	    }

	    return nCheck % 10 === 0;
	  },


	  // http://docs.jquery.com/Plugins/Validation/Methods/equalTo

	  equalTo: function equalTo(field, rule, fields) {
	    return field.value === fields[rule.compareField].value;
	  }
	};
	exports.default = _default;
	;

	var _temp = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }

	  __REACT_HOT_LOADER__.register(_default, 'default', '/home/rharik/Development/cannibal/freakin-react-forms/src/helpers/validation/validationRules.js');
	}();

	;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.propToLabel = propToLabel;

	var _uuid = __webpack_require__(8);

	var _uuid2 = _interopRequireDefault(_uuid);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function propToLabel(val) {
	  return val ? val.replace(/([A-Z])/g, ' $1')
	  // uppercase the first character
	  .replace(/^./, function (str) {
	    return str.toUpperCase();
	  }) : val;
	}

	var normalizeModel = function normalizeModel(props, events) {
	  var formName = props.formName || _uuid2.default.v4();
	  var model = props.model;
	  var modelArray = model && Object.keys(model).map(function (x, i) {
	    //validate required props
	    var item = model[x];
	    var value = item.value || '';
	    if (item.type === 'array' && value === '') {
	      value = [];
	    }

	    var clone = Object.assign({}, item);
	    clone.label = propToLabel(item.label || item.name);
	    clone.placeholder = propToLabel(item.placeholder) || propToLabel(item.label || item.name);
	    clone.rules = item.rules || [];
	    clone.value = value;
	    clone.onChange = events.onChangeHandler;
	    clone.onBlur = events.onBlurHandler;
	    clone.errors = [];
	    clone.invalid = false;
	    clone.formName = formName;
	    clone.key = formName + '_' + i;
	    return clone;
	  });
	  return modelArray.reduce(function (prev, next) {
	    prev[next.name] = next;
	    return prev;
	  }, {});
	};

	var _default = normalizeModel;
	exports.default = _default;
	;

	var _temp = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }

	  __REACT_HOT_LOADER__.register(propToLabel, 'propToLabel', '/home/rharik/Development/cannibal/freakin-react-forms/src/helpers/normalizeModel.js');

	  __REACT_HOT_LOADER__.register(normalizeModel, 'normalizeModel', '/home/rharik/Development/cannibal/freakin-react-forms/src/helpers/normalizeModel.js');

	  __REACT_HOT_LOADER__.register(_default, 'default', '/home/rharik/Development/cannibal/freakin-react-forms/src/helpers/normalizeModel.js');
	}();

	;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	//     uuid.js
	//
	//     Copyright (c) 2010-2012 Robert Kieffer
	//     MIT License - http://opensource.org/licenses/mit-license.php

	// Unique ID creation requires a high quality random # generator.  We feature
	// detect to determine the best RNG source, normalizing to a function that
	// returns 128-bits of randomness, since that's what's usually required
	var _rng = __webpack_require__(9);

	// Maps for number <-> hex string conversion
	var _byteToHex = [];
	var _hexToByte = {};
	for (var i = 0; i < 256; i++) {
	  _byteToHex[i] = (i + 0x100).toString(16).substr(1);
	  _hexToByte[_byteToHex[i]] = i;
	}

	// **`parse()` - Parse a UUID into it's component bytes**
	function parse(s, buf, offset) {
	  var i = (buf && offset) || 0, ii = 0;

	  buf = buf || [];
	  s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
	    if (ii < 16) { // Don't overflow!
	      buf[i + ii++] = _hexToByte[oct];
	    }
	  });

	  // Zero out remaining bytes if string was short
	  while (ii < 16) {
	    buf[i + ii++] = 0;
	  }

	  return buf;
	}

	// **`unparse()` - Convert UUID byte array (ala parse()) into a string**
	function unparse(buf, offset) {
	  var i = offset || 0, bth = _byteToHex;
	  return  bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]];
	}

	// **`v1()` - Generate time-based UUID**
	//
	// Inspired by https://github.com/LiosK/UUID.js
	// and http://docs.python.org/library/uuid.html

	// random #'s we need to init node and clockseq
	var _seedBytes = _rng();

	// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
	var _nodeId = [
	  _seedBytes[0] | 0x01,
	  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
	];

	// Per 4.2.2, randomize (14 bit) clockseq
	var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

	// Previous uuid creation time
	var _lastMSecs = 0, _lastNSecs = 0;

	// See https://github.com/broofa/node-uuid for API details
	function v1(options, buf, offset) {
	  var i = buf && offset || 0;
	  var b = buf || [];

	  options = options || {};

	  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

	  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
	  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
	  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
	  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
	  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

	  // Per 4.2.1.2, use count of uuid's generated during the current clock
	  // cycle to simulate higher resolution clock
	  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

	  // Time since last uuid creation (in msecs)
	  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

	  // Per 4.2.1.2, Bump clockseq on clock regression
	  if (dt < 0 && options.clockseq === undefined) {
	    clockseq = clockseq + 1 & 0x3fff;
	  }

	  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
	  // time interval
	  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
	    nsecs = 0;
	  }

	  // Per 4.2.1.2 Throw error if too many uuids are requested
	  if (nsecs >= 10000) {
	    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
	  }

	  _lastMSecs = msecs;
	  _lastNSecs = nsecs;
	  _clockseq = clockseq;

	  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
	  msecs += 12219292800000;

	  // `time_low`
	  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
	  b[i++] = tl >>> 24 & 0xff;
	  b[i++] = tl >>> 16 & 0xff;
	  b[i++] = tl >>> 8 & 0xff;
	  b[i++] = tl & 0xff;

	  // `time_mid`
	  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
	  b[i++] = tmh >>> 8 & 0xff;
	  b[i++] = tmh & 0xff;

	  // `time_high_and_version`
	  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
	  b[i++] = tmh >>> 16 & 0xff;

	  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
	  b[i++] = clockseq >>> 8 | 0x80;

	  // `clock_seq_low`
	  b[i++] = clockseq & 0xff;

	  // `node`
	  var node = options.node || _nodeId;
	  for (var n = 0; n < 6; n++) {
	    b[i + n] = node[n];
	  }

	  return buf ? buf : unparse(b);
	}

	// **`v4()` - Generate random UUID**

	// See https://github.com/broofa/node-uuid for API details
	function v4(options, buf, offset) {
	  // Deprecated - 'format' argument, as supported in v1.2
	  var i = buf && offset || 0;

	  if (typeof(options) == 'string') {
	    buf = options == 'binary' ? new Array(16) : null;
	    options = null;
	  }
	  options = options || {};

	  var rnds = options.random || (options.rng || _rng)();

	  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
	  rnds[6] = (rnds[6] & 0x0f) | 0x40;
	  rnds[8] = (rnds[8] & 0x3f) | 0x80;

	  // Copy bytes to buffer, if provided
	  if (buf) {
	    for (var ii = 0; ii < 16; ii++) {
	      buf[i + ii] = rnds[ii];
	    }
	  }

	  return buf || unparse(rnds);
	}

	// Export public API
	var uuid = v4;
	uuid.v1 = v1;
	uuid.v4 = v4;
	uuid.parse = parse;
	uuid.unparse = unparse;

	module.exports = uuid;


/***/ },
/* 9 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {
	var rng;

	var crypto = global.crypto || global.msCrypto; // for IE 11
	if (crypto && crypto.getRandomValues) {
	  // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
	  // Moderately fast, high quality
	  var _rnds8 = new Uint8Array(16);
	  rng = function whatwgRNG() {
	    crypto.getRandomValues(_rnds8);
	    return _rnds8;
	  };
	}

	if (!rng) {
	  // Math.random()-based (RNG)
	  //
	  // If all else fails, use Math.random().  It's fast, but is of unspecified
	  // quality.
	  var  _rnds = new Array(16);
	  rng = function() {
	    for (var i = 0, r; i < 16; i++) {
	      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
	      _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
	    }

	    return _rnds;
	  };
	}

	module.exports = rng;


	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	var _selectn = __webpack_require__(11);

	var _selectn2 = _interopRequireDefault(_selectn);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var decorateInput = function decorateInput(children, model) {
	  return _react2.default.Children.map(children, function (x) {
	    // if you have ternary logic that returns null x will be null
	    if (!x || !x.props) {
	      return x;
	    }
	    var property = model[(0, _selectn2.default)('frfProperty.name', x.props)];
	    if (property) {
	      if ((typeof property === 'undefined' ? 'undefined' : _typeof(property)) !== 'object') {
	        throw new Error('No property on model with name: ' + x.frfProperty + '!');
	      }
	      // so if your Inputs are redux containers, they will not rerender if the top level properties
	      // of "modelProperty" have not changed, since we are changing the deeper values, we need a
	      // couple hacks here (dataVal and rerenderHack) to trigger a rerender if those props have changed
	      return _react2.default.cloneElement(x, {
	        data: property,
	        dataVal: property.value,
	        rerenderHack: property.errors.length > 0 ? property.errors : undefined
	      });
	    }
	    var clonedItems = decorateInput(x.props.children, model);
	    return _react2.default.cloneElement(x, { children: clonedItems });
	  });
	};

	var _default = decorateInput;
	exports.default = _default;
	;

	var _temp = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }

	  __REACT_HOT_LOADER__.register(decorateInput, 'decorateInput', '/home/rharik/Development/cannibal/freakin-react-forms/src/helpers/decorateInputs.js');

	  __REACT_HOT_LOADER__.register(_default, 'default', '/home/rharik/Development/cannibal/freakin-react-forms/src/helpers/decorateInputs.js');
	}();

	;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var curry2 = __webpack_require__(12)
	var debug = __webpack_require__(14)('selectn')
	var dotted = __webpack_require__(18)
	var splits = __webpack_require__(19)
	var string = Object.prototype.toString

	module.exports = curry2(selectn)

	/**
	 * Curried property accessor function that resolves deeply-nested object properties via dot/bracket-notation
	 * string path while mitigating `TypeErrors` via friendly and composable API.
	 *
	 * @param {String|Array} path
	 * Dot/bracket-notation string path or array.
	 *
	 * @param {Object} object
	 * Object to access.
	 *
	 * @return {Function|*|undefined}
	 * (1) returns `selectn/1` when partially applied.
	 * (2) returns value at path if path exists.
	 * (3) returns undefined if path does not exist.
	 */
	function selectn (path, object) {
	  debug('arguments:', {
	    path: path,
	    object: object
	  })

	  var idx = -1
	  var seg = string.call(path) === '[object Array]' ? path : splits(dotted(path))
	  var end = seg.length
	  var ref = end ? object : void 0

	  while (++idx < end) {
	    if (Object(ref) !== ref) return void 0
	    ref = ref[seg[idx]]
	  }

	  debug('ref:', ref)
	  return typeof ref === 'function' ? ref() : ref
	}


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	/*!
	 * imports.
	 */

	var bind = Function.prototype.bind || __webpack_require__(13)

	/*!
	 * exports.
	 */

	module.exports = curry2

	/**
	 * Curry a binary function.
	 *
	 * @param {Function} fn
	 * Binary function to curry.
	 *
	 * @param {Object} [self]
	 * Function `this` context.
	 *
	 * @return {Function|*}
	 * If partially applied, return unary function, otherwise, return result of full application.
	 */

	function curry2 (fn, self) {
	  var out = function () {
	    if (arguments.length === 0) return out

	    return arguments.length > 1
	      ? fn.apply(self, arguments)
	      : bind.call(fn, self, arguments[0])
	  }

	  out.uncurry = function uncurry () {
	    return fn
	  }

	  return out
	}


/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	module.exports = function(boundThis) {
	  var f = this
	    , ret

	  if (arguments.length < 2)
	    ret = function() {
	      if (this instanceof ret) {
	        var ret_ = f.apply(this, arguments)
	        return Object(ret_) === ret_
	          ? ret_
	          : this
	      }
	      else
	        return f.apply(boundThis, arguments)
	    }
	  else {
	    var boundArgs = new Array(arguments.length - 1)
	    for (var i = 1; i < arguments.length; i++)
	      boundArgs[i - 1] = arguments[i]

	    ret = function() {
	      var boundLen = boundArgs.length
	        , args = new Array(boundLen + arguments.length)
	        , i
	      for (i = 0; i < boundLen; i++)
	        args[i] = boundArgs[i]
	      for (i = 0; i < arguments.length; i++)
	        args[boundLen + i] = arguments[i]

	      if (this instanceof ret) {
	        var ret_ = f.apply(this, args)
	        return Object(ret_) === ret_
	          ? ret_
	          : this
	      }
	      else
	        return f.apply(boundThis, args)
	    }
	  }

	  ret.prototype = f.prototype
	  return ret
	}


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {
	/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = __webpack_require__(16);
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = 'undefined' != typeof chrome
	               && 'undefined' != typeof chrome.storage
	                  ? chrome.storage.local
	                  : localstorage();

	/**
	 * Colors.
	 */

	exports.colors = [
	  'lightseagreen',
	  'forestgreen',
	  'goldenrod',
	  'dodgerblue',
	  'darkorchid',
	  'crimson'
	];

	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */

	function useColors() {
	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	  return (typeof document !== 'undefined' && 'WebkitAppearance' in document.documentElement.style) ||
	    // is firebug? http://stackoverflow.com/a/398120/376773
	    (window.console && (console.firebug || (console.exception && console.table))) ||
	    // is firefox >= v31?
	    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
	}

	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */

	exports.formatters.j = function(v) {
	  return JSON.stringify(v);
	};


	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */

	function formatArgs() {
	  var args = arguments;
	  var useColors = this.useColors;

	  args[0] = (useColors ? '%c' : '')
	    + this.namespace
	    + (useColors ? ' %c' : ' ')
	    + args[0]
	    + (useColors ? '%c ' : ' ')
	    + '+' + exports.humanize(this.diff);

	  if (!useColors) return args;

	  var c = 'color: ' + this.color;
	  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-z%]/g, function(match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });

	  args.splice(lastC, 0, c);
	  return args;
	}

	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */

	function log() {
	  // this hackery is required for IE8/9, where
	  // the `console.log` function doesn't have 'apply'
	  return 'object' === typeof console
	    && console.log
	    && Function.prototype.apply.call(console.log, console, arguments);
	}

	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */

	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      exports.storage.removeItem('debug');
	    } else {
	      exports.storage.debug = namespaces;
	    }
	  } catch(e) {}
	}

	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */

	function load() {
	  var r;
	  try {
	    r = exports.storage.debug;
	  } catch(e) {}

	  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	  if ('env' in (typeof process === 'undefined' ? {} : process)) {
	    r = process.env.DEBUG;
	  }
	  
	  return r;
	}

	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */

	exports.enable(load());

	/**
	 * Localstorage attempts to return the localstorage.
	 *
	 * This is necessary because safari throws
	 * when a user disables cookies/localstorage
	 * and you attempt to access it.
	 *
	 * @return {LocalStorage}
	 * @api private
	 */

	function localstorage(){
	  try {
	    return window.localStorage;
	  } catch (e) {}
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ },
/* 15 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = debug.debug = debug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(17);

	/**
	 * The currently active debug mode names, and names to skip.
	 */

	exports.names = [];
	exports.skips = [];

	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lowercased letter, i.e. "n".
	 */

	exports.formatters = {};

	/**
	 * Previously assigned color.
	 */

	var prevColor = 0;

	/**
	 * Previous log timestamp.
	 */

	var prevTime;

	/**
	 * Select a color.
	 *
	 * @return {Number}
	 * @api private
	 */

	function selectColor() {
	  return exports.colors[prevColor++ % exports.colors.length];
	}

	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */

	function debug(namespace) {

	  // define the `disabled` version
	  function disabled() {
	  }
	  disabled.enabled = false;

	  // define the `enabled` version
	  function enabled() {

	    var self = enabled;

	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;

	    // add the `color` if not set
	    if (null == self.useColors) self.useColors = exports.useColors();
	    if (null == self.color && self.useColors) self.color = selectColor();

	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }

	    args[0] = exports.coerce(args[0]);

	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %o
	      args = ['%o'].concat(args);
	    }

	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);

	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });

	    // apply env-specific formatting
	    args = exports.formatArgs.apply(self, args);

	    var logFn = enabled.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }
	  enabled.enabled = true;

	  var fn = exports.enabled(namespace) ? enabled : disabled;

	  fn.namespace = namespace;

	  return fn;
	}

	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */

	function enable(namespaces) {
	  exports.save(namespaces);

	  var split = (namespaces || '').split(/[\s,]+/);
	  var len = split.length;

	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/[\\^$+?.()|[\]{}]/g, '\\$&').replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}

	/**
	 * Disable debug output.
	 *
	 * @api public
	 */

	function disable() {
	  exports.enable('');
	}

	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */

	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}

	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */

	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}


/***/ },
/* 17 */
/***/ function(module, exports) {

	/**
	 * Helpers.
	 */

	var s = 1000
	var m = s * 60
	var h = m * 60
	var d = h * 24
	var y = d * 365.25

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} options
	 * @throws {Error} throw an error if val is not a non-empty string or a number
	 * @return {String|Number}
	 * @api public
	 */

	module.exports = function (val, options) {
	  options = options || {}
	  var type = typeof val
	  if (type === 'string' && val.length > 0) {
	    return parse(val)
	  } else if (type === 'number' && isNaN(val) === false) {
	    return options.long ?
				fmtLong(val) :
				fmtShort(val)
	  }
	  throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val))
	}

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  str = String(str)
	  if (str.length > 10000) {
	    return
	  }
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str)
	  if (!match) {
	    return
	  }
	  var n = parseFloat(match[1])
	  var type = (match[2] || 'ms').toLowerCase()
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n
	    default:
	      return undefined
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtShort(ms) {
	  if (ms >= d) {
	    return Math.round(ms / d) + 'd'
	  }
	  if (ms >= h) {
	    return Math.round(ms / h) + 'h'
	  }
	  if (ms >= m) {
	    return Math.round(ms / m) + 'm'
	  }
	  if (ms >= s) {
	    return Math.round(ms / s) + 's'
	  }
	  return ms + 'ms'
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtLong(ms) {
	  return plural(ms, d, 'day') ||
	    plural(ms, h, 'hour') ||
	    plural(ms, m, 'minute') ||
	    plural(ms, s, 'second') ||
	    ms + ' ms'
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, n, name) {
	  if (ms < n) {
	    return
	  }
	  if (ms < n * 1.5) {
	    return Math.floor(ms / n) + ' ' + name
	  }
	  return Math.ceil(ms / n) + ' ' + name + 's'
	}


/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';

	/*!
	 * exports.
	 */

	module.exports = brackets2dots;

	/*!
	 * regexp patterns.
	 */

	var REPLACE_BRACKETS = /\[([^\[\]]+)\]/g;
	var LFT_RT_TRIM_DOTS = /^[.]*|[.]*$/g;

	/**
	 * Convert string with bracket notation to dot property notation.
	 *
	 * ### Examples:
	 *
	 *      brackets2dots('group[0].section.a.seat[3]')
	 *      //=> 'group.0.section.a.seat.3'
	 *
	 *      brackets2dots('[0].section.a.seat[3]')
	 *      //=> '0.section.a.seat.3'
	 *
	 *      brackets2dots('people[*].age')
	 *      //=> 'people.*.age'
	 *
	 * @param  {String} string
	 * original string
	 *
	 * @return {String}
	 * dot/bracket-notation string
	 */

	function brackets2dots(string) {
	  return ({}).toString.call(string) == '[object String]'
	       ? string.replace(REPLACE_BRACKETS, '.$1').replace(LFT_RT_TRIM_DOTS, '')
	       : ''
	}


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	/*!
	 * imports.
	 */

	var dotted = __webpack_require__(20)(todots)
	var compact = __webpack_require__(23)(String)
	var toString = Object.prototype.toString

	/*!
	 * exports.
	 */

	module.exports = dotsplit

	/**
	 * Transform dot-delimited strings to array of strings.
	 *
	 * @param  {String} string
	 * Dot-delimited string.
	 *
	 * @return {Array}
	 * Array of strings.
	 */

	function dotsplit (string) {
	  return dotted(normalize(string))
	}

	/**
	 * Normalize string by:
	 *
	 * (1) Dropping falsey values (empty, null, etc.)
	 * (2) Replacing escapes with a placeholder.
	 * (3) Splitting string on `.` delimiter.
	 * (4) Dropping empty values from resulting array.
	 *
	 * @param  {String} string
	 * Dot-delimited string.
	 *
	 * @return {Array}
	 * Array of strings.
	 */

	function normalize (string) {
	  return compact(
	    (toString.call(string) === '[object String]' ? string : '')
	    .replace(/\\\./g, '\uffff')
	    .split('.')
	  )
	}

	/**
	 * Change placeholder to dots.
	 *
	 * @param  {String} string
	 * Dot-delimited string with placeholders.
	 *
	 * @return {String}
	 * Dot-delimited string without placeholders.
	 */

	function todots (string) {
	  return string.replace(/\uffff/g, '.')
	}


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	/*!
	 * imports.
	 */

	var curry2 = __webpack_require__(21)
	var selectn = __webpack_require__(22)

	/*!
	 * exports.
	 */

	module.exports = curry2(map)

	/**
	 * Curried function deriving new array values by applying provided function to each item/index of provided array.
	 * Optionally, a dot-notation formatted string may be provided for item property access.
	 *
	 * @param {Function|String} fn
	 * Function to apply to each item.
	 *
	 * @param {Array} list
	 * Array to iterate over.
	 *
	 * @return {Array}
	 * Array resulting from applying provided function `fn` to each item of `list`.
	 */

	function map (fn, list) {
	  var end = list.length
	  var idx = -1
	  var out = []

	  while (++idx < end) {
	    out.push((typeof fn === 'string') ? selectn(fn, list[idx]) : fn(list[idx]))
	  }

	  return out
	}


/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict'

	/*!
	 * exports.
	 */

	module.exports = curry2

	/**
	 * Curry a binary function.
	 *
	 * @param {Function} fn
	 * Binary function to curry.
	 *
	 * @param {Object} [self]
	 * Function `this` context.
	 *
	 * @return {Function|*}
	 * If partially applied, return unary function, otherwise, return result of full application.
	 */

	function curry2 (fn, self) {
	  var out = function () {
	    return arguments.length > 1
	    ? fn.call(self, arguments[0], arguments[1])
	    : fn.bind(self, arguments[0])
	  }

	  out.uncurry = function uncurry () {
	    return fn
	  }

	  return out
	}


/***/ },
/* 22 */
/***/ function(module, exports) {

	/*!
	 * exports.
	 */

	module.exports = selectn;

	/**
	 * Select n-levels deep into an object given a dot/bracket-notation query.
	 * If partially applied, returns a function accepting the second argument.
	 *
	 * ### Examples:
	 *
	 *      selectn('name.first', contact);
	 *
	 *      selectn('addresses[0].street', contact);
	 *
	 *      contacts.map(selectn('name.first'));
	 *
	 * @param  {String | Array} query
	 * dot/bracket-notation query string or array of properties
	 *
	 * @param  {Object} object
	 * object to access
	 *
	 * @return {Function}
	 * accessor function that accepts an object to be queried
	 */

	function selectn(query) {
	  var parts;

	  if (Array.isArray(query)) {
	    parts = query;
	  }
	  else {
	    // normalize query to `.property` access (i.e. `a.b[0]` becomes `a.b.0`)
	    query = query.replace(/\[(\d+)\]/g, '.$1');
	    parts = query.split('.');
	  }

	  /**
	   * Accessor function that accepts an object to be queried
	   *
	   * @private
	   *
	   * @param  {Object} object
	   * object to access
	   *
	   * @return {Mixed}
	   * value at given reference or undefined if it does not exist
	   */

	  function accessor(object) {
	    var ref = (object != null) ? object : (1, eval)('this');
	    var len = parts.length;
	    var idx = 0;

	    // iteratively save each segment's reference
	    for (; idx < len; idx += 1) {
	      if (ref != null) ref = ref[parts[idx]];
	    }

	    return ref;
	  }

	  // curry accessor function allowing partial application
	  return arguments.length > 1
	       ? accessor(arguments[1])
	       : accessor;
	}


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	/*!
	 * imports.
	 */

	var curry2 = __webpack_require__(12)
	var selectn = __webpack_require__(11)

	/*!
	 * imports (local).
	 */

	var expressions = __webpack_require__(24)

	/*!
	 * exports.
	 */

	module.exports = curry2(filter)

	/**
	 * Curried function deriving a new array containing items from given array for which predicate returns true.
	 * Supports unary function, RegExp, dot/bracket-notation string path, and compound query object as predicate.
	 *
	 * @param {Function|RegExp|String|Object} predicate
	 * Unary function, RegExp, dot/bracket-notation string path, and compound query object.
	 *
	 * @param {Array} list
	 * Array to evaluate.
	 *
	 * @return {Array}
	 * New array containing items from given array for which predicate returns true.
	 */

	function filter (predicate, list) {
	  var end = list.length
	  var idx = -1
	  var out = []

	  while (++idx < end) {
	    if (matchall(expressions(predicate, list[idx]))) out.push(list[idx])
	  }

	  return out
	}

	/**
	 * Whether all given expressions evaluate to true.
	 *
	 * @param {Array} expressions
	 * Expressions to evaluate.
	 *
	 * @return {Boolean}
	 * Whether all given expressions evaluate to true.
	 */

	function matchall (expressions) {
	  var end = expressions.length
	  var idx = -1
	  var out = false

	  while (++idx < end) {
	    var expression = expressions[idx]

	    if (({}).toString.call(expression.predicate) === '[object Function]') {
	      out = !!expression.predicate(expression.element)
	    } else if (({}).toString.call(expression.predicate) === '[object RegExp]') {
	      out = !!expression.predicate.exec(expression.element)
	    } else if (expression.compare) {
	      out = expression.predicate === expression.element
	    } else {
	      out = selectn(expression.predicate, expression.element)
	    }

	    if (out === false) {
	      return out
	    }
	  }

	  return out
	}


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	/*!
	 * imports.
	 */

	var selectn = __webpack_require__(11)

	/*!
	 * exports.
	 */

	module.exports = expressions

	/**
	 * Creates and returns an array of expression objects.
	 *
	 * Example:
	 *
	 *  {
	 *    predicate: 'received',
	 *    element: 'received',
	 *    compare: true
	 *  }
	 *
	 *  {
	 *    predicate: isBoolean,
	 *    element: true
	 *  }
	 *
	 *  {
	 *    predicate: 'message.read',
	 *    element: { message: { read: true } }
	 *  }
	 *
	 * @param {Function|String|Object} predicate
	 * Unary function, RegExp, dot/bracket-notation string path, and compound query object.
	 *
	 * @param {Array} list
	 * Array to iterate over.
	 *
	 * @return {Array}
	 * New array containing items from given array for which predicate returns true.
	 */

	function expressions (predicate, element) {
	  var expressions = []

	  if (isFunction(predicate) || isRegExp(predicate) || isString(predicate)) {
	    expressions.push({predicate: predicate, element: element})
	  } else {
	    for (var key in predicate) {
	      expressions.push({predicate: predicate[key], element: selectn(key, element), compare: true})
	    }
	  }

	  return expressions
	}

	/**
	 * Whether predicate is a RegExp instance.
	 *
	 * @param {*} predicate
	 * Predicate value to test.
	 *
	 * @return {Boolean}
	 * Whether predicate is a RegExp instance.
	 */

	function isRegExp (predicate) {
	  return ({}).toString.call(predicate) === '[object RegExp]'
	}

	/**
	 * Whether predicate is a function.
	 *
	 * @param {*} predicate
	 * Predicate value to test.
	 *
	 * @return {Boolean}
	 * Whether predicate is a function.
	 */

	function isFunction (predicate) {
	  return ({}).toString.call(predicate) === '[object Function]'
	}

	/**
	 * Whether predicate is a string.
	 *
	 * @param {*} predicate
	 * Predicate value to test.
	 *
	 * @return {Boolean}
	 * Whether predicate is a string.
	 */

	function isString (predicate) {
	  return ({}).toString.call(predicate) === '[object String]'
	}


/***/ }
/******/ ])
});
;