import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


const AjaxStateComponent = ({ ajaxState }) => {
  return (
    <div>
      {ajaxState && ajaxState.type === 'REQUEST' ? 'loading...' : ''}
    </div>
  );
};

AjaxStateComponent.propTypes = {
  ajaxState: PropTypes.object
};


const mapStateToProps = function(state, props) {
  return {
    ajaxState: state.ajaxState[props.prefix]
  };
};

export default connect(mapStateToProps)(AjaxStateComponent);
