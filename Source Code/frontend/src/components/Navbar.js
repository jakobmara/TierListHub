import { Component } from 'react';
import '../css/Navbar.css';
import {
    Redirect

  } from "react-router-dom";
import UserProfileMenu from "./UserProfMenu"
import Button from '@material-ui/core/Button';





class Navbar extends Component{
    constructor(props){
        super(props)
        this.pressedLogin = this.pressedLogin.bind(this)
        this.pressedSignup = this.pressedSignup.bind(this)
        this.onLogOut = this.onLogOut.bind(this)
        this.setRedirectToHomePage = this.setRedirectToHomePage.bind(this)
        this.createTemplate = this.createTemplate.bind(this)

        
        this.state = {
            redirect : null, 
            userId: this.props.userId, 
            anchorEl: null, 
            menuOpen: false}

    }

    onLogOut(){
        this.props.onLogOut()
        this.setState({userId: null})
    }



    pressedLogin(){

        this.setState({redirect:"/login"})
        if (this.props.currentPage === "login"){
            window.location.reload()
        }


    }
    pressedSignup(){

        this.setState({redirect:"/signup"})
        if (this.props.currentPage === "signup"){
            window.location.reload()
        }
    }


    setRedirectToHomePage(e) {
        e.preventDefault()
        let redirectUrl = "/"
        this.setState({ redirect: redirectUrl})
        if (this.props.currentPage === "home"){
            window.location.reload()
        }
    }

    createTemplate(){
        this.setState({ redirect: "/createTemplate"})
        if (this.props.currentPage === "createTemplate"){
            window.location.reload()
        }
        
    }

    render(){
        if (this.state.redirect){
            return <Redirect 
						to={{
							pathname : this.state.redirect,
							state: {
								userId: this.state.userId,
							}
						}}
					/>
        }
        var navButtons = []
        if (this.state.userId){
            navButtons = [
                <Button key="1" className="login-btn" onClick={this.createTemplate}>Create template</Button>,
            <UserProfileMenu key="2" className="userProfileMenu login-btn" userId = {this.state.userId} onLogOut={this.onLogOut}/>
            ]
        } else {
            navButtons = [                    
                <Button key="1" className ="login-btn"onClick={this.pressedSignup}>Sign Up</Button>,
                <Button key="2" className="login-btn"onClick={this.pressedLogin}>Log In</Button>
            ]
        }
        
        return (
            <div className="body">
                <div className="navBar">
                <div className ="title">
                    <div className="flex-auto">
                   <img className="logo" alt="Website logo" onClick={this.setRedirectToHomePage} src="https://i.imgur.com/J5hmVvj.png"/>
                   </div>
                   <div className="flex-last">
                    {navButtons}
                    </div>
                </div>
            </div>
            </div>
            )
        
    }
}
export default Navbar;