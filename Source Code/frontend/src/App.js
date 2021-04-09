import './App.css';
import { Component } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";

import CreateTierList from './components/CreateTierList';
import UserSignUp from './components/UserSignUp';
import UserLogin from './components/Login'
import reportWebVitals from './reportWebVitals';
import Home from "./components/home"

class App extends Component {
  render(){
    return <Router>
      <Switch>

        <Route exact path="/signup">
        <UserSignUp/>
        </Route>
        <Route exact path="/login">
        <UserLogin/>
        </Route>
        <Route exact path="/createTemplate">
        <CreateTierList/>
        </Route>
        <Route path="/" >
        <Home/>
        </Route>


      </Switch>

    </Router>
  }
}

export default App;
