import React, { Component } from 'react';
import Month from './Month';
import CalendarHead from './CalendarHead';
import { AH, NiceDate } from '../../helpers';
import { Query } from 'react-apollo'
import {
  TODOS_QUERY,
  TODO_SUBSCRIPTION,
  LOGIN_QUERY
} from '../../graphql'
import './calendar.css'
import { Redirect } from 'react-router-dom';

let unsubscribe = null

class Calendar extends Component {

  today = new NiceDate();
  state = { openedMonth: new NiceDate(`${this.today.month}.1.${this.today.year}`)};

  onMonthChange = (command) => {
    const amount = command === 'prev' ? -1 : 1;
    this.setState((state) => ({
      openedMonth: NiceDate.newDate(state.openedMonth, 0, amount),
    }));
  };

  componentDidMount(){
    document.addEventListener("keydown", this.keyFunction, false);
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.keyFunction, false);
  }

  keyFunction = e => {
    if(e.keyCode === 37) {
      this.setState((state) => ({
        openedMonth: NiceDate.newDate(state.openedMonth, 0, -1),
      }));
    }
    else if (e.keyCode === 39){
      this.setState((state) => ({
        openedMonth: NiceDate.newDate(state.openedMonth, 0, 1),
      }));
    }
  }

  handleCalendarTodo = (todos) => {
    let new_todos = []
    for (let i = todos.length-1; i >= 0; i--){
      let dayIdx = new_todos.findIndex(({ date }) => date.show() === new NiceDate(todos[i].date).show());
      new_todos =  dayIdx !== -1 ? AH.modifyElement(new_todos, dayIdx, ({ date, activities }) => ({date,
                                   activities: [Calendar.newActivity(todos[i].id,todos[i].text), ...activities]}))
                                : [Calendar.newDay(new NiceDate(todos[i].time), todos[i].id, todos[i].text), ...new_todos]

    }
    return new_todos;
  };

  static newActivity = (_id ,name) => ({
    id: _id,
    name,
  });

  static newDay = (date, _id, name) => ({
    date,
    activities: [Calendar.newActivity(_id, name,)],
  });



  render() {
    const {openedMonth} = this.state;
    
    return (
      <Query query={LOGIN_QUERY}>
      {({ loading, error, data}) => {
      if (loading) return <p>Loading...</p>
      if (error) return <p>Error :(((</p>
      this.login_user = data.isLogin
      if (this.login_user)
      return (
        <Query query={TODOS_QUERY}>
            {({loading, error, data, subscribeToMore}) => {
            if (loading) return <p>Loading...</p>
            if (error) return <p>Error...</p>
            if (!unsubscribe)
                unsubscribe = subscribeToMore({
                    document: TODO_SUBSCRIPTION,
                    updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data) return prev
                        if (subscriptionData.data.TODO.mutation === 'CREATED'){
                          const newFile = subscriptionData.data.TODO.data
                          return {
                            ...prev,
                            getTODOs: [...prev.getTODOs,newFile]
                          }
                        }
                        else if (subscriptionData.data.TODO.mutation === 'DELETED'){
                            const deleteFile = subscriptionData.data.TODO.data
                            const Files = prev.getTODOs.filter(todo => todo.id!==deleteFile.id)
                            return {
                              ...prev,
                              getTODOs: Files
                            }
                        }
                    }
                })
            let todos = data.getTODOs;
            let todos_calendar = this.handleCalendarTodo(todos);
            const currentTodos = todos_calendar.filter((el) =>
              [openedMonth.month - 1, openedMonth.month, openedMonth.month + 1]
                .map((el) => (el < 0 ? 12 + el : el > 12 ? el - 12 : el))
                .includes(el.date.month)
            );
            return (
              <div className="calendar">
                <div className="calendar__body">
                <Month
                  monthObj={openedMonth}
                  todos={currentTodos}
                />
                </div>
                <CalendarHead
                  label={`${openedMonth.monthName}, ${openedMonth.year}`}
                  onMonthChange={this.onMonthChange}
                />
              </div>
            )
            }}
          </Query>)
        else 
          return <Redirect to="/login" />;}}
        </Query>
    );
  }
}

export default Calendar;
