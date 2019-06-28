import React from 'react';
import '../todo.css'

export default props => {
  return <input type="text" 
                name="text"
                className="todo-app__input"  
                placeholder="What needs to be done? (please give date for priority)"
                onChange={props.onChange}
                value={props.value}
                id="todo-input"
         />;
}