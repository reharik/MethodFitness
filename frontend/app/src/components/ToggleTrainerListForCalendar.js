import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ToggleTrainerListForCalendar extends Component {
  state = {
    items: [],
    allSelected: true,
  };

  UNSAFE_componentWillReceiveProps(newProps) {
    if (this.state.items.length <= 0 && newProps.items.length > 0) {
      this.setState({
        items: newProps.items.map(x => ({ ...x, selected: true })),
        allSelected: true,
      });
      this.props.toggleTrainerListForCalendar(newProps.items.map(x => x.id));
    }
  }

  toggle = id => {
    let result;
    let allSelected = !id && !this.state.allSelected;
    if (id && this.state.allSelected) {
      result = this.state.items.map(
        x => (x.id !== id ? { ...x, selected: false } : x), // eslint-disable-line no-confusing-arrow
      );
    } else if (id) {
      result = this.state.items.map(
        x => (x.id === id ? { ...x, selected: !x.selected } : x), // eslint-disable-line no-confusing-arrow
      );
      if (result.every(x => x.selected)) {
        allSelected = true;
      }
    } else {
      result = this.state.items.map(x => ({
        ...x,
        selected: !this.state.allSelected,
      }));
    }
    this.props.toggleTrainerListForCalendar(
      result.filter(x => x.selected).map(x => x.id),
    );
    this.setState({ allSelected, items: [...result] });
  };

  render() {
    let allSelectedClass = this.state.allSelected
      ? 'toggleTrainerListForCalendar__button__selected'
      : '';

    return (
      <div className="toggleTrainerListForCalendar__container">
        <button
          className={`toggleTrainerListForCalendar__button ${allSelectedClass}`}
          onClick={() => this.toggle()}
        >
          {' '}
          All
        </button>
        <hr />
        <ul>
          {this.state.items.map(x => {
            let selectedClass = x.selected
              ? 'toggleTrainerListForCalendar__button__selected'
              : '';

            return (
              <li key={x.id}>
                <button
                  className={`toggleTrainerListForCalendar__button ${selectedClass}`}
                  onClick={() => this.toggle(x.id)}
                >
                  {' '}
                  {x.name}{' '}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

ToggleTrainerListForCalendar.propTypes = {
  toggleTrainerListForCalendar: PropTypes.func,
};

export default ToggleTrainerListForCalendar;
