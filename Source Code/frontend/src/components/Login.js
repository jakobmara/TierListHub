import { Component } from 'react';
import React, { useState } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory,
    useLocation
  } from "react-router-dom";

class UserLogin extends Component {
    constructor (props){
        super(props)
        this.state = {username: '', password:'', errorMessage: '', redirect: null}
        this.validLogin = this.validLogin.bind(this)
        this.handleLogin = this.handleLogin.bind(this)

    }

    setUsername(e){
        this.setState({username:e})
        console.log("username: " + e)
    }

    setPassword(e){
        this.setState({password:e})

        console.log("password: " + e)
    }


    validLogin(){
        return (this.state.username.length > 0 && this.state.password.length > 0)
            
        
    }

    handleLogin(e){
        e.preventDefault()
        if (this.validLogin()){
            console.log("sending data")
            let requestInfo = {
                method: 'POST',
                headers: {
                    content_type:"application/json",
                },
                body: JSON.stringify(this.state)
            }
            fetch('http://localhost:5000/login',requestInfo)
            .then(response => {
                console.log("response: " + response)
                return response.json()
            })
            .then(json => {
                console.log(json)
                if (json.errorMessage === "incorrect password or username"){
                    this.setState({errorMessage: json.errorMessage})
                }else{
                    this.setState({errorMessage : ""})
                    this.setState({redirect: "/CreateTierList"});

                }

            })
            
    } 
        
    }



    render(){
        if (this.state.redirect){          
            return <Redirect to={this.state.redirect}/>
        }
        return (
            
            <div className="body">
                <div className ="title">
                    <h1>User Login</h1>
                    <img src="https://i.imgur.com/J5hmVvj.png"/>
                
                <br/>
                
                <br/> <p> { this.state.errorMessage } </p>
                </div>
                <div className="tableDiv" action="http://localhost:5000/signUp" method="POST">
                    <form onSubmit = {this.handleLogin}>
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
                    </tbody>
                    </table>
                    <button type="submit" onClick={this.userLogin}>Login</button>
                    </form>
            </div>
            </div>
        );
    }
}
export default UserLogin;