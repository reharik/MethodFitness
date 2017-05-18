'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var Notif = (function (_React$Component) {
  _inherits(Notif, _React$Component);

  function Notif() {
    var _this = this;

    _classCallCheck(this, Notif);

    _get(Object.getPrototypeOf(Notif.prototype), 'constructor', this).apply(this, arguments);

    this._onActionClick = function (event) {
      event.preventDefault();
      if (_this.props.onActionClick) {
        _this.props.onActionClick(_this.props.id);
      } else {
        return;
      }
    };
  }

  _createClass(Notif, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this._id = new Date().getTime();
    }

    /*
     * Handle action click event
     * @description Handle click events on the
     */
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var kind = _props.kind;
      var CustomComponent = _props.CustomComponent;
      var componentClassName = _props.componentClassName;
      var actionLabel = _props.actionLabel;

      var component = !CustomComponent ? _react2['default'].createElement(
        'div',
        { className: componentClassName + ' ' + componentClassName + '--' + kind },
        _react2['default'].createElement('div', { className: componentClassName + '__icon' }),
        _react2['default'].createElement(
          'div',
          { className: componentClassName + '__content' },
          _react2['default'].createElement(
            'span',
            { className: componentClassName + '__message' },
            this.props.message
          )
        ),
        actionLabel && _react2['default'].createElement(
          'span',
          { className: componentClassName + '__action' },
          _react2['default'].createElement(
            'button',
            { onClick: this._onActionClick },
            this.props.actionLabel
          )
        ),
        _react2['default'].createElement('div', { className: componentClassName + '__close' })
      ) : _react2['default'].createElement(CustomComponent, this.props);

      return component;
    }
  }]);

  return Notif;
})(_react2['default'].Component);

Notif.defaultProps = {
  kind: 'info'
};

Notif.propTypes = {
  id: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number]).isRequired,
  message: _react2['default'].PropTypes.string.isRequired,
  kind: _react2['default'].PropTypes.oneOf(['success', 'info', 'warning', 'danger']).isRequired,
  componentClassName: _react2['default'].PropTypes.string,
  onActionClick: _react2['default'].PropTypes.func,
  actionLabel: _react2['default'].PropTypes.string,
  CustomComponent: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.func, _react2['default'].PropTypes.node, _react2['default'].PropTypes.element])
};

exports['default'] = Notif;
module.exports = exports['default'];