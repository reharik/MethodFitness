/**
 * Created by reharik on 3/8/16.
 */
let React = require('react');
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
      <div ref="inner" className="slider-inner-wrapper">
        {children}
      </div>
    </CSSTransitionGroup>
  </div>
);

export default SlideTransition;
