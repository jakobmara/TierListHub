import { Component } from 'react';
import React from "react";
import '../css/home.css';
import Navbar from './Navbar';
import {
    Redirect

  } from "react-router-dom";

class Home extends Component{

    constructor(props){  
        super(props);
        if (this.props.location.state.userID == undefined){
            this.state = {redirect : null, userID: null}
        }else{
            this.state = {redirect : null, userID: this.props.location.state.userID}
        }

        console.log("MY PROPS",this.props)
        console.log("CONSTRUCTING homepage, userID: " + this.state.userID)
        console.log("MY THIS: ",this)
    }

    render(){
        if (this.state.redirect){
            return <Redirect to={this.state.redirect}/>
        }
        return (
            <div >
                <Navbar userID={this.state.userID}>  </Navbar>
                
            GALLERY
            </div>

        );
    }
}
export default Home;