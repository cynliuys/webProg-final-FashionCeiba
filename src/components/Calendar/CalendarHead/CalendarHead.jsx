import React, { Component } from 'react';
import '../calendar.css'

class CalendarHead extends Component {
  shouldComponentUpdate({ label: newLabel }) {
    return this.props.label !== newLabel;
  }

  render() {
    const { label, onMonthChange } = this.props;
    return (
      <div className="calendar__head">
        <CalendarHeadButton name="prev" {...{ onMonthChange }} />

        <span className="calendar__head__title">
          <h5 style={{margin:'0'}}>{label}</h5>
        </span>

        <CalendarHeadButton name="next" {...{ onMonthChange }} />
      </div>
    );
  }
}

const CalendarHeadButton = ({ name, onMonthChange }) => {
  return (
    <button
      onClick={() => onMonthChange(name)}
      key={`calendar_btn-${name}`}
      className={`calendar__head__button calendar__head__button--${name} btn--round`}
    >
    <h2>v</h2>
    </button>
  );
};

export default CalendarHead;
