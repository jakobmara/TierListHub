import { Component } from 'react';
import React from "react";
import '../css/home.css';

import {
    Redirect

  } from "react-router-dom";

class Home extends Component{

    constructor(props){
        super(props)
        this.pressedLogin = this.pressedLogin.bind(this)
        this.pressedSignup = this.pressedSignup.bind(this)
        this.state = {redirect : null, userID: null}
    }

    pressedLogin(){
        console.log("logging in")
        this.setState({redirect:"/login"})
    }
    pressedSignup(){
        console.log("signing up")
        this.setState({redirect:"/signup"})
    }

    render(){
        if (this.state.redirect){
            return <Redirect to={this.state.redirect}/>
        }
        return (
            <div>
            <div className="body">
                <div className="navBar">
                <div className ="title">
                    <img alt="" className="logo"  src="https://i.imgur.com/J5hmVvj.png"/>
                <button className ="login-btn"onClick={this.pressedSignup}>sign up</button>
                <button className="login-btn"onClick={this.pressedLogin}>Login</button>
                </div>
                </div>
                
            GALLERY
            </div>
            </div>

        );
    }
}
export default Home;