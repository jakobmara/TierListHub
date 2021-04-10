import { Component } from 'react';
import React from "react";
import '../css/home.css';
import Navbar from './Navbar';
import {
    Redirect,
    useHistory

  } from "react-router-dom";
class Home extends Component{

    constructor(props){  
        super(props);
        console.log("IN HOME CONSTRUCTOR")
        console.log(this.props.location)

        if (this.props.location.state == undefined || this.props.location.state.userID == undefined){
            this.state = {redirect : null, userID: null}
        
        } else {
            this.state = {redirect : null, userID: this.props.location.state.userID}
            console.log("props location in home: ", this.props.location.state)   
        }
        
        this.onLogOut = this.onLogOut.bind(this);
    }

    onLogOut(){
        console.log("IN home logging out")
        this.setState({userID:null})
        window.history.replaceState({}, document.title)
    }

    render(){
        if (this.state.redirect){
            return <Redirect to={this.state.redirect}/>
        }
        console.log("USER ID IN HOME: ", this.state.userID)
        return (
            <div >
                <Navbar userID={this.state.userID} onLogOut={this.onLogOut}>  </Navbar>   
            GALLERY
            </div>

        );
    }
}
export default Home;