import React, { Component } from 'react';
import Todo from '../Todo';
import { classNames } from '../../../helpers';
import { NiceDate } from '../../../helpers';
import '../calendar.css'
class CalendarTile extends Component {

  render() {
    const {
      dayObj,
      activities,
      isFromOtherMonth,
    } = this.props;
    
    const isEmpty = activities.filter(todo => !todo.done).length === 0;
    const todos = activities.filter(todo => !todo.done).map((todo) => 
      <Todo
        todoObj={todo}
        key={`todo-${todo.id}`}/>);

    const weekend = (dayObj.day === 0 || dayObj.day === 6);
    const today = (dayObj.show() === new NiceDate().show());

    return (
      <div
        className={classNames(
          'tile',
          { 'tile--other-month': isFromOtherMonth },
          { 'tile--not-empty': !isEmpty }
        )}
      >
        <div className="tile__content">{todos}</div>        

        <div className="tile__label">
          <div className="tile__label__name" 
          style={{ color: today ? '#ecb745' : (weekend ? 'rgb(197, 86, 86)': '#57636e') }}>{dayObj.date}</div>
        </div>
      </div>
    );
  }
}

export default CalendarTile;
