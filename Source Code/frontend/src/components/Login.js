import { Component } from 'react';
import React from "react";
import Navbar from './Navbar';
import {
    BrowserRouter as Router,
    Redirect
  } from "react-router-dom";


class UserLogin extends Component {
    constructor (props){
        super(props)
        this.state = {username: '', password:'', errorMessage: '', redirect: null, userId : null}
        this.valIdLogin = this.valIdLogin.bind(this)
        this.handleLogin = this.handleLogin.bind(this)
        this.setUsername = this.setUsername.bind(this)
        this.setPassword = this.setPassword.bind(this)
        
    }

    setUsername(e){
        this.setState({username: e.target.value})
    }

    setPassword(e){
        this.setState({password: e.target.value})
    }


    valIdLogin(){
        return (this.state.username.length > 0 && this.state.password.length > 0)
    }

    handleLogin(e){
        e.preventDefault()
        if (this.valIdLogin()){
            console.log("sending data")
            let requestInfo = {
                method: 'POST',
                headers: {
                    content_type:"application/json",
                },
                body: JSON.stringify(this.state)
            }
            fetch('http://localhost:5000/login', requestInfo)
            .then(response => {
                console.log("response: " + response)
                return response.json()
            })
            .then(json => {
                console.log(json)
                console.log("Log userId: " + json.userId)
                if (json.userId === undefined){
                    this.setState({errorMessage: json.errorMessage})
                }else{
                    console.log(json)
                    this.setState({errorMessage: ""})
                    this.setState({userId: json.userId})
                    this.setState({redirect: "/"});                   
                }
            })  
        }     
    }

    render(){
        if (this.state.redirect){          
           
            return <Redirect 
            to={{
                pathname : this.state.redirect,
                state: {
                    userId : this.state.userId,
                    myPage : "login"
                },
            }}
            />
        }
        
        return (
            
            <div>
                <Navbar currentPage={"login"}/>

                <div className ="title">
                    <h1>User Login</h1>
                    <img alt="" src="https://i.imgur.com/J5hmVvj.png"/>
                
                <br/>
                
                <br/> <p> { this.state.errorMessage } </p>
                </div>
                <div className="tableDiv" action="http://localhost:5000/signUp" method="POST">
                    <form onSubmit = {this.handleLogin}>
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