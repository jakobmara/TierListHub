import { Component } from 'react';
import React from "react";
import '../css/ProfilePage.css';
import Navbar from './Navbar';
import { Redirect } from "react-router-dom";

class ProfilePage extends Component {

    constructor(props){

        console.log("profile page this:",this)
        this.state = {
            userId: this.props.match.params.userId,
            tierLists: [],
            templates: []
        }

    }

    render(){
        return (
            <div>
                <Navbar/>
                User profile page 
                </div>
        )
    }

}
export default ProfilePage