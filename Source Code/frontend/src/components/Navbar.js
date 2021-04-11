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
        this.setRedirectToHomePage = this.setRedirectToHomePage.bind(this)
        console.log("navbar props: ", this.props)
        
        this.state = {
            redirect : null, 
            userId: this.props.userId, 
            anchorEl: null, 
            menuOpen: false}

    }

    componentDidMount(){
        console.log("REMOUNTING")
    }

    onLogOut(){
        this.props.onLogOut()
        this.setState({userId: null})
    }



    pressedLogin(){
        console.log("logging in")
        console.log("THIS IN LOGIN",this)

        this.setState({redirect:"/login"})
        if (this.props.currentPage === "login"){
            console.log("reloading page")
            window.location.reload()
        }


    }
    pressedSignup(){
        console.log("signing up")
        console.log("this in signup:",this)

        this.setState({redirect:"/signup"})
        if (this.props.currentPage === "signup"){
            console.log("reloading signup page")
            window.location.reload()
        }
    }


    setRedirectToHomePage(e) {
        let redirectUrl = "/"
        this.setState({ redirect: redirectUrl})
    }

    render(){
        if (this.state.redirect){
            console.log("REDIRECTING AGAIN")
            return <Redirect to={this.state.redirect}/>
        }
        var navButtons = []
        if (this.state.userId){
            console.log(this.state)
            navButtons = [<UserProfileMenu userId = {this.state.userId} onLogOut={this.onLogOut}/>]
        } else {
            console.log("NO USER ID GIVING DEFAULT BUTTONS")
            navButtons = [                    
                <button key="1" className ="login-btn"onClick={this.pressedSignup}>Sign Up</button>,
                <button key="2" className="login-btn"onClick={this.pressedLogin}>Log In</button>
            ]
        }
        
        return (
            <div className="body">
                <div className="navBar">
                <div className ="title">
                   <img className="logo" alt=""  onClick={this.setRedirectToHomePage} src="https://i.imgur.com/J5hmVvj.png"/>
                    {navButtons}
                </div>
            </div>
            </div>
            )
        
    }
}
export default Navbar;