import React from 'react';
import logo from '../img/x.png';
import '../todo.css'

export default props => {
    return (
        <li className="todo-app__item">
            <p className="todo-app__item-time">
            {props.todo.time}
            </p>
            <h1 className="todo-app__item-detail">
            {props.todo.text}
            </h1>
            {
                props.login_user.email==='ADMIN'?
                <img className="todo-app__item-x" src={logo} alt="X" onClick={props.delete}></img>:
                null
            }
        </li> );
}