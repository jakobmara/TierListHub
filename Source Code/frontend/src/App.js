import './css/App.css';
import { Component } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import CreateTemplate from './components/CreateTemplate';
import CreateTierList from './components/CreateTierList';
import UserSignUp from './components/UserSignUp';
import UserLogin from './components/Login'
import Home from "./components/home"
class App extends Component {
  render(){
    return <Router>
      <Switch>

        <Route exact path="/signup" component={UserSignUp}></Route>
        
        <Route exact path="/login" component={UserLogin}></Route>
        
        <Route exact path="/createTemplate" component={CreateTemplate}></Route>
        
        <Route path="/" component={Home}></Route>


      </Switch>
    </Router>
  }
}

export default App;
