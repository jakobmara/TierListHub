import { Component } from 'react';
import React, { useState } from "react";
import '../home.css';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory,
    useLocation
  } from "react-router-dom";

class Home extends Component{

    constructor(props){
        super(props)

    }



    render(){
        return (
            <div>
            <div className="body">
                <div className="navBar">
                <div className ="title">
                    <img className="logo"  src="https://i.imgur.com/J5hmVvj.png"/>
                <button className ="login-btn">sign up</button>
                <button className="login-btn">Login</button>
                </div>
                </div>
                
            GALLERY
            </div>
            </div>

        );
    }
}
export default Home;