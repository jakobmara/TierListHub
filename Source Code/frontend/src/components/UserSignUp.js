import { Component } from 'react';
import React, { useState } from "react";
import '../UserSignUp.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory,
    useLocation
  } from "react-router-dom";

class UserSignUp extends Component {
    constructor (props){
        super(props)
        this.state = {username: '', password:'', confirmation: '', errorMessage: '', redirect: false}
        this.registerLogin = this.registerLogin.bind(this)
        this.confirmPassword = this.confirmPassword.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleRedirect = this.handleRedirect.bind(this)
        console.log("CONSTRUCTING")
    }


    
    validateLogin(){
        console.log('validiting login')
        return this.state.password.length > 0 && this.state.username.length > 0
    }
    setUsername(e){
        this.setState({username:e})
        console.log("username: " + e)
    }

    setPassword(e){
        this.setState({password:e})

        console.log("password: " + e)
    }

    setConfirmation(e){
        this.state.confirmation = e
    }

    confirmPassword(){
        return this.state.confirmation === this.state.password
    }

    registerLogin(){
        console.log("DO SOMETHING")
        if (this.validateLogin()){
            if (this.confirmPassword()){
                //submit the info to backend
                console.log("sent info to backend")
                //this.setState({errorMessage: ""})
                return true

            }else{
                this.setState({errorMessage: "Confirmation password doesn't match given password"})
                return false

            }
        }else{
            console.log("didn't pass check")
            this.setState({errorMessage: "Please fill out all fields"})
            return false
        }
    }

    handleSubmit(e){
        e.preventDefault()
        if (this.registerLogin()){
            console.log("sending data")
            let requestInfo = {
                method: 'POST',
                headers: {
                    content_type:"application/json",
                },
                body: JSON.stringify(this.state)
            }
            fetch('http://localhost:5000/signUp',requestInfo)
            .then(response => {
                console.log("response: " + response)
                return response.json()
            })
            .then(json => {
                console.log(json)
                if (json.errorMessage === "username already exists"){
                    this.setState({errorMessage: json.errorMessage})
                }else{
                    this.setState({errorMessage : ""})
                    this.setState({redirect: true})
                    this.handleRedirect();
                    <Route exact path="/" render={() => (<Redirect to="/CreateTierList" />)} />          

                }

            })
            
            
        }
    }

    handleRedirect(){
        console.log("REDIRECTING");
        let loggedIn = true;
        
    }

    render() {
        
        return (
            
            <div className="body">
                <div className ="title">
                    <h1>User Sign up</h1>
                    <img src="https://i.imgur.com/J5hmVvj.png"/>
                
                <br/>
                
                <br/> <p> { this.state.errorMessage } </p>
                </div>
                <div className="tableDiv" action="http://localhost:5000/signUp" method="POST">
                    <form onSubmit = {this.handleSubmit}>
                    <table>
                        <tbody>
                    <tr>
                        <td>Username: </td>
                        <td><input id="userName" placeholder="Username" onChange={(e) => this.setUsername(e.target.value)}/></td>
                    </tr>
                    <tr>
                        <td>Password:  </td>
                        <td> <input id="password" placeholder="Password" onChange= {(e) => this.setPassword(e.target.value)} type="Password"/> </td>
                    </tr>
                    <tr>
                        <td>Password Confirmation:</td>
                        <td> <input  id="confirm"  placeholder="Confirm password" onChange= {(e) => this.setConfirmation(e.target.value)} type="Password"/> </td>
                    </tr>
                    </tbody>
                    </table>
                    <button type="submit" onClick={this.registerLogin}>Sign up</button>
                    </form>
            </div>
            </div>
        );
    }
}
export default UserSignUp;