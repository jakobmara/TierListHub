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
        this.handleClick = this.handleClick.bind(this)
        this.handleClose = this.handleClose.bind(this)
        var navButtons = []
        console.log("my props: ", this.props.userID)
        
        this.state = {redirect : null, 
            userID: this.props.userID, 
            navButtons:navButtons, 
            anchorEl: null, 
            menuOpen: false}
        console.log("NAVBAR this: ", this.props.userID)

    }

    componentDidMount(){
        var navButtons = []
        if (this.state.userID){
            console.log("CHANGING NAV BUTTONS")
            navButtons = [<UserProfileMenu userID = {this.state.userID}/>]
        } else {
            navButtons = [                    
                <button key="1" className ="login-btn"onClick={this.pressedSignup}>Sign Up</button>,
                <button key="2" className="login-btn"onClick={this.pressedLogin}>Log In</button>
            ]
        }

        this.setState({navButtons : navButtons})
    }

    handleClick(event){
        console.log("CLICK?")
        this.setState({anchorEl: event.currentTarget})
        this.setState({menuOpen : true})
      };

    
    handleClose(){
        this.setState({anchorEl: null})
        this.setState({menuOpen : false})

      };

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
            <div className="body">
                <div className="navBar">
                <div className ="title">
                    <a href="/"><img className="logo" alt=""  src="https://i.imgur.com/J5hmVvj.png"/></a>
                    {this.state.navButtons}
                </div>
            </div>
            </div>
            )
        
    }
}
export default Navbar;