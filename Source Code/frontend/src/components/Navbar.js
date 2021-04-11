import { Component } from 'react';
import '../css/Navbar.css';
import {
    Redirect

  } from "react-router-dom";
import UserProfileMenu from "./UserProfMenu"
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));




class Navbar extends Component{
    constructor(props){
        super(props)
        this.pressedLogin = this.pressedLogin.bind(this)
        this.pressedSignup = this.pressedSignup.bind(this)
        this.onLogOut = this.onLogOut.bind(this)
        this.setRedirectToHomePage = this.setRedirectToHomePage.bind(this)
        this.createTemplate = this.createTemplate.bind(this)

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
            window.location.reload()
        }


    }
    pressedSignup(){
        console.log("signing up")
        console.log("this in signup:",this)

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
        console.log("creating template")
        this.setState({ redirect: "/createTemplate"})
        if (this.props.currentPage === "createTemplate"){
            window.location.reload()
        }
        
    }

    render(){
        if (this.state.redirect){
            console.log("REDIRECTING AGAIN")
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
            console.log(this.state)
            navButtons = [
                <Button key="2" className="login-btn" onClick={this.createTemplate}>Create template</Button>,
            <UserProfileMenu className="userProfileMenu" className="login-btn"userId = {this.state.userId} onLogOut={this.onLogOut}/>
            ]
        } else {
            console.log("NO USER ID GIVING DEFAULT BUTTONS")
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
                   <a href="#"><img className="logo" alt=""  onClick={this.setRedirectToHomePage} src="https://i.imgur.com/J5hmVvj.png"/></a>
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