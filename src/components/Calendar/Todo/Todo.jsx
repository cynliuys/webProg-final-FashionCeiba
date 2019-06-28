import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '../../../helpers';
import '../calendar.css'

class Todo extends Component {
  static propTypes = {
    todoObj: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
  };

  static defaultProps = {
    todoObj: {
      id: -1,
      name: 'DEFAULT THING TO DO',
    },
    isInputActive: false,
  };

  render() {
    const { todoObj, isInputActive } = this.props;
    const { name } = todoObj;

    return (
      <div className={classNames('todo')}>
        <input
          className="todo__name"
          value={name}
          alt={name}
          autoFocus={isInputActive}
          disabled={!isInputActive}
          onChange={this.onTodoInput}
          type="text"
          name="name"
          placeholder="What to do?"
          autoComplete="off"
        />
      </div>
    );
  }
}

export default Todo;
