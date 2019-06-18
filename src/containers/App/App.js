import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Main from '../Main/Main';
import Login from '../Login/Login';
import Register from '../Register/Register';
const App = () => (
    <div>
      <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/main" component={Main} />
        <Redirect from="/" to="/login" />
      </Switch>
      </BrowserRouter>
    </div>
  );
  
export default App;