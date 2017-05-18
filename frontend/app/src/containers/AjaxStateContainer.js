import React from 'react';
import {connect} from 'react-redux';


const AjaxStateComponent = ({ajaxState}) => {
  return (
    <div>
      { ajaxState && ajaxState.type === 'REQUEST' ? 'loading...' : '' }
    </div>
  );
};

const mapStateToProps = function(state, props) {
  return {
    ajaxState: state.ajaxState[props.prefix],
  }
};

export default connect(mapStateToProps)(AjaxStateComponent);

