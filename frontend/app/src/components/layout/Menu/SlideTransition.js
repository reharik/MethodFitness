import React from 'react';
import PropTypes from 'prop-types';

const CSSTransitionGroup = require('react-addons-css-transition-group');

const SlideTransition = ({ direction, children }) => (
  <div className="slider-outer-wrapper items-container">
    <CSSTransitionGroup
      transitionEnterTimeout={300}
      transitionLeaveTimeout={500}
      className="slider-transition-group"
      component="div"
      transitionName={direction}
    >
      <div className="slider-inner-wrapper">
        {children}
      </div>
    </CSSTransitionGroup>
  </div>
);

SlideTransition.propTypes = {
  direction: PropTypes.string,
  children: PropTypes.array
};

export default SlideTransition;
