import React, { Component } from 'react';
import Input from './Section_component/Input';
import TodoItem from './Section_component/TodoItem';
import './todo.css'
import { Query, Mutation } from 'react-apollo'
import {
    TODOS_QUERY,
    CREATE_TODO_MUTATION,
    DELETE_TODO_MUTATION,
    TODO_SUBSCRIPTION,
    LOGIN_QUERY,
} from '../../graphql'
import { Redirect } from 'react-router-dom';



class Board extends Component {

    constructor(props){
        super(props);
        this.login_user = null;
        this.unsubscribe = null
    }

    addTodo = (todo) => {
        this.createTodo({
            variables: {
                text: todo.text,
                time: todo.time}
            })
    };

    removeTodo = (id) => {
        this.deleteTodo({
            variables: {
                id: id
            }
        })
    };

    render() {
        return (
            <Query query={LOGIN_QUERY}>
              {({ loading, error, data}) => {
                if (loading) return <p>Loading...</p>
                if (error) return <p>Error :(((</p>
                this.login_user = data.isLogin
                if (!this.login_user)
                    return <Redirect to="/login" />;
                else
                    return (
                        <section className="todo-app__main" id="todo-main"  >
                            {this.login_user.email === 'ADMIN'?
                            <Mutation  mutation={CREATE_TODO_MUTATION}>
                            {createTodo => {
                            this.createTodo = createTodo
                            return (
                                <Input add={this.addTodo}/>
                            )}}
                            </Mutation>:null}
                            <Query query={TODOS_QUERY}>
                            {({loading, error, data, subscribeToMore}) => {
                            if (loading) return <p>Loading...</p>
                            if (error) return <p>Error...</p>
                            if (!this.unsubscribe)
                                this.unsubscribe = subscribeToMore({
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
                            todos.sort(function(a,b){return  new Date(a.time) - new Date(b.time)});
                            if (todos.length!==0)
                                return (
                                    <Mutation mutation={DELETE_TODO_MUTATION}>
                                    {deleteTodo => {
                                        this.deleteTodo = deleteTodo;
                                        return (
                                        <ul className="todo-app__list" style={this.login_user.email === 'ADMIN'?{maxHeight:'15em'}:{maxHeight:'20em'}} >
                                            {
                                                todos.map((todo) =>                    
                                                <TodoItem
                                                key = {todo.id} 
                                                todo = {todo}
                                                delete={() => this.removeTodo(todo.id)}
                                                login_user = {this.login_user}
                                                />)
                                            }
                                        </ul>
                                        )
                                    }}
                                    </Mutation>
                                )
                            else{ 
                                if (this.login_user.email==='ADMIN')
                                    return null
                                else
                                    return <h1>No Posts</h1>
                            }}}  
                            </Query>
                        </section>)
                }}
            </Query>
        );
    };
}

export default Board;
