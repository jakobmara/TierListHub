import { Component } from 'react';
import '../css/Navbar.css';
import {
    Redirect

  } from "react-router-dom";
import UserProfileMenu from "./UserProfMenu"


class Navbar extends Component{
    constructor(props){
        super(props)
        this.pressedLogin = this.pressedLogin.bind(this)
        this.pressedSignup = this.pressedSignup.bind(this)
        this.onLogOut = this.onLogOut.bind(this)
        console.log("navbar props: ", this.props)
        
        this.state = {redirect : null, 
            userId: this.props.userId, 
            anchorEl: null, 
            menuOpen: false}

    }

    onLogOut(){
        this.props.onLogOut()
        this.setState({userId: null})
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
        var navButtons = []
        if (this.state.userId){
            console.log("CHANGING NAV BUTTONS")
            navButtons = [<UserProfileMenu userId = {this.state.userId} onLogOut={this.onLogOut}/>]
        } else {
            navButtons = [                    
                <button key="1" className ="login-btn"onClick={this.pressedSignup}>Sign Up</button>,
                <button key="2" className="login-btn"onClick={this.pressedLogin}>Log In</button>
            ]
        }
        return (
            <div className="body">
                <div className="navBar">
                <div className ="title">
                    <a href="/"><img className="logo" alt=""  src="https://i.imgur.com/J5hmVvj.png"/></a>
                    {navButtons}
                </div>
            </div>
            </div>
            )
        
    }
}
export default Navbar;