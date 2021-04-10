import { Component } from 'react';
import React from "react";
import '../css/UserSignUp.css';
import Navbar from './Navbar';

import {
    Route,
    Redirect

  } from "react-router-dom";

class UserSignUp extends Component {
    constructor (props){
        super(props)
        this.state = {
            username: '', 
            password:'', 
            confirmation: '', 
            errorMessage: '', 
            redirect: false, 
            userID : null
        }
        this.registerLogin = this.registerLogin.bind(this)
        this.confirmPassword = this.confirmPassword.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.setUsername = this.setUsername.bind(this)
        this.setPassword = this.setPassword.bind(this)
        this.setConfirmation = this.setConfirmation.bind(this)
        console.log("CONSTRUCTING")
    }


    
    validateLogin(){
        console.log('validiting login')
        return this.state.password.length > 0 && this.state.username.length > 0
    }
    setUsername(e){
        this.setState({username:e.target.value})
        console.log("username: " + e.target.value)
    }

    setPassword(e){
        this.setState({password:e.target.value})

        console.log("password: " + e.target.value)
    }

    setConfirmation(e){
        this.setState({confirmation: e.target.value})
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
                    this.setState({userID : json.userID})
                    this.setState({redirect: true})
                }
            }) 
        }
    }



    render() {
        if (this.state.redirect){
            return <Redirect to={{
                pathname : "/",
                state: {userID : this.state.userID}
            }}
            />
        }
        return (
            
            <div >
                <div id="navigation">
                <Navbar></Navbar>
            </div>
                <div className ="title">
                    <h1>User Sign up</h1>
                    <img alt="" src="https://i.imgur.com/J5hmVvj.png"/>
                
                <br/>
                
                <br/> <p> { this.state.errorMessage } </p>
                </div>
                <div className="tableDiv" action="http://localhost:5000/signUp" method="POST">
                    <form onSubmit = {this.handleSubmit}>
                    <table>
                        <tbody>
                    <tr>
                        <td>Username: </td>
                        <td><input id="userName" placeholder="Username" onChange={this.setUsername}/></td>
                    </tr>
                    <tr>
                        <td>Password:  </td>
                        <td> <input id="password" placeholder="Password" onChange= {this.setPassword} type="Password"/> </td>
                    </tr>
                    <tr>
                        <td>Password Confirmation:</td>
                        <td> <input  id="confirm"  placeholder="Confirm password" onChange= {this.setConfirmation} type="Password"/> </td>
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