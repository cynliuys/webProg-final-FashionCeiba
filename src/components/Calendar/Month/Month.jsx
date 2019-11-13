import React from 'react';
import { NiceDate } from '../../../helpers';
import CalendarTile from '../CalendarTile';
import '../calendar.css'

const Month = ({ monthObj, todos, ...todoEvents }) => {
  const monthTiles = [
    ...Array(6).fill([...Array(7).keys()].map((elem) => elem + 1)),
  ].map((week, idxW) =>
    week.map((day) => {

      const tetha = NiceDate.newDate(monthObj, day - monthObj.day + 7 * idxW - 1);
      const dayInTodos = todos.find((el) => el.date.show() === tetha.show());
      return (
        <CalendarTile
          dayObj={tetha}
          activities={dayInTodos ? dayInTodos.activities : []}
          isFromOtherMonth={tetha.month !== monthObj.month}
          key={`tile-${tetha.show()}`}
          {...todoEvents}
        />
      );
    })
  );
  const week = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const week_items = week.map((name) => (    
    <div className='tile' key={name}>
      <div className="tile__label">
          <div className="tile__label__name">{name}</div>
      </div>
    </div>));

  return (
  <div>
    <div className="mymonth">
      {week_items}
      {monthTiles}
    </div>
  </div>
  );
};

export default Month;
