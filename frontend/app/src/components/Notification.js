import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, message } from 'antd';

class SuccessMsg extends Component {
  componentWillReceiveProps(newProps) {
    if (newProps.notification
      && newProps.notification.type === 'success') {
      if ((!this.props.notification
        && newProps.notification.message)
        || (this.props.notification
        && this.props.notification.message !== newProps.notification.message)) {
        message.success(newProps.notification.message);
      }
    }
  }

  render() {
    if(!this.props.notification) {
      return null;
    }
    switch(this.props.notification.type) {
      case 'error': {
        return (<div><Alert message={this.props.notification.message} type="error" showIcon /></div>);
      }
      default: {
        return null;
      }
    }
  }
}

SuccessMsg.propTypes = {
  notification: PropTypes.object
};

export default SuccessMsg;
