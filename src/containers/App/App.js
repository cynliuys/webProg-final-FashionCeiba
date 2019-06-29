import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Main from '../Main/Main';
import Login from '../Login/Login';
import Register from '../Register/Register';
import Bar from '../../components/Bar/bar'
import CourseInfo from '../../components/CourseInfo/CourseInfo'
import TeacherInfo from '../../components/TeacherInfo/TeacherInfo'
import Board from '../../components/Board/Board'
import Calendar from '../../components/Calendar/Calendar'

const App = () => (
    <div>
      <BrowserRouter>
      <Bar />
      <Switch>
        <Route path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/main" component={Main} />
        <Route exact path="/courseinfo" component={CourseInfo} />
        <Route exact path="/teacherinfo" component={TeacherInfo} />
        <Route exact path="/board" component={Board} />
        <Route exact path="/calendar" component={Calendar} />
        <Redirect from="/" to="/login" />
      </Switch>
      </BrowserRouter>
    </div>
  );
  
export default App;