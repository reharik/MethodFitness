import React, { PropTypes } from 'react';

const HeaderDateNav = ({viewType,
                        increment,
                        decrement,
                        selectToday,
                        retrieveDataAction,
                        calendarName
                      }) => {
  const viewChangedEventAction = (func, view) => {
    func(view, calendarName);
    //TODO this doesn't seem like it would work
    retrieveDataAction(view)
  };

  return (
    <div className="redux__task__calendar__header__date__nav">
      <button className="redux__task__calendar__header__date__nav__button"
        onClick={() => viewChangedEventAction(decrement, viewType)}>
        <i>{'<'}</i>
      </button>
      <button className="redux__task__calendar__header__date__nav__button"
        onClick={() => viewChangedEventAction(increment, viewType)}>
        <i>{'>'}</i>
      </button>
      <button className="redux__task__calendar__header__date__nav__button"
        onClick={() => viewChangedEventAction(selectToday, viewType)}>Today</button>
    </div>
	);
};

HeaderDateNav.propTypes = {
  viewType: PropTypes.string.isRequired,
  increment: PropTypes.func.isRequired,
  decrement: PropTypes.func.isRequired,
  selectToday: PropTypes.func.isRequired,
  retrieveDataAction: PropTypes.func.isRequired,
  calendarName: PropTypes.string.isRequired
};

export default HeaderDateNav;
