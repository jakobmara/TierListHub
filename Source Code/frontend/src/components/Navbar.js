import { Component } from 'react';
import '../css/Navbar.css';

class Navbar extends component{
    constructor(props){
        super(props)

    }


    render(){
        return(
            <div className="body">
                <div className="navBar">
                <div className ="title">
                    <a href="/"><img className="logo"  src="https://i.imgur.com/J5hmVvj.png"/></a>
                <button className ="login-btn"onClick={this.pressedSignup}>sign up</button>
                <button className="login-btn"onClick={this.pressedLogin}>Login</button>
                </div>
            </div>
            </div>
        )
    }
}