import { Component } from 'react';
import React from "react";
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Redirect } from 'react-router-dom';


class UserProfileMenu extends Component{
    
    constructor(props) {
        super(props)

        this.handleClick = this.handleClick.bind(this)
        this.handleClose = this.handleClose.bind(this)

        this.state = {
            userId : this.props.userId,
            anchorEl: null, 
            menuOpen: false,
            username: null,
            redirect: null
        }

    }

    async componentDidMount() {
        console.log(this.state)
        let response = await fetch('/getUsername/' + this.state.userId)
        let responseJson = await response.json()
        this.setState({username : responseJson.userName})
    }

    handleClick(event) {
        console.log("CLICK?")
        console.log(event.currentTarget)
        this.setState({anchorEl: event.currentTarget})
        this.setState({menuOpen : true})
    };

    
    handleClose(event){
        console.log(event.currentTarget.id)
        if (event.currentTarget.id == "Logout"){
            console.log("logged out")
            this.setState({ userId : null})
            this.props.onLogOut()
            alert("Logged out succesfully")

        }
        if(event.currentTarget.id=="account"){
            console.log("user profile")
            this.setState({redirect : "/user/" + this.state.userId})
        }
        this.setState({anchorEl: null})
        this.setState({menuOpen : false})

    };
    

    render() {
        if (this.state.redirect){
            return <Redirect 
            to={{
                pathname : this.state.redirect,
                state: {
                    userId : this.state.userId,
                    myPage : "userProfile"
                },
            }}
            />
        }

        return (
            <div>
                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
                            {this.state.username}
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={this.state.anchorEl}
                    keepMounted
                    open={this.state.menuOpen}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.handleClose} id="account">My account</MenuItem>
                    <MenuItem onClick={this.handleClose} id="Logout" >Logout</MenuItem>
                </Menu>
            </div>
        );
    }

}

export default UserProfileMenu