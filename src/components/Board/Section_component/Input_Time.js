import React from 'react';
import '../todo.css'

export default props => {
  return <input type="date" 
                name="time"
                className="todo-app__input-time"
                onChange={props.onChange}
                value={props.value}
                id="todo-input-time"
                min="2019-01-01" 
                max="2099-12-31"
         />;
}