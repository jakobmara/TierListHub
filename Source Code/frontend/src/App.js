import './css/App.css';
import { Component } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import CreateTemplate from './components/CreateTemplate';
import CreateTierList from './components/CreateTierList';
import TemplateDetailView from './components/TemplateDetailView';
import UserSignUp from './components/UserSignUp';
import UserLogin from './components/Login'
import Home from "./components/Home"
import ProfilePage from "./components/ProfilePage"


class App extends Component {
  render(){
    return <Router>
      <Switch>

        <Route exact path="/signup" component={UserSignUp}/>
        
        <Route exact path="/login" component={UserLogin}/>
        
        <Route exact path="/templateDetail/:templateId" component={TemplateDetailView}/>

        <Route exact path="/createTierList/:templateId" component={CreateTierList}/>

        <Route exact path="/user/:userId" component={ProfilePage}/>

        <Route exact path="/createTemplate" component={CreateTemplate}/>


        <Route path="/" component={Home}/>


      </Switch>
    </Router>
  }
}

export default App;
