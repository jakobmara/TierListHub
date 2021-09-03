import { Component } from 'react';
import React from "react";
import '../css/home.css';
import Navbar from './Navbar';
import { Redirect } from "react-router-dom";
import TemplateDisplayComponent from './TemplateDisplayComponent';
import { Container } from '@material-ui/core';

class Home extends Component{

    constructor(props){  
        super(props);

        this.createTemplate = this.createTemplate.bind(this)
        this.onLogOut = this.onLogOut.bind(this);
        this.setRedirectToTemplateDetailView = this.setRedirectToTemplateDetailView.bind(this)


        var userId = null
        if (this.props.location.state !== undefined && this.props.location.state.userId !== undefined) {
            userId = this.props.location.state.userId
        }

        this.state = {
            userId: userId,
            templates: [],
            redirect: null
        }
        document.body.style = 'background-color: #0f0f0f;';

    }
    async componentDidMount() {
        let requestUrl = 'http://localhost:5000/templates?page=1&size=20'
        let request = await fetch(requestUrl)
        let request_json = await request.json()
        let templates = request_json.map((template) => {
            return {
                id: template.id,
                title: template.title,
                img: template.img,
                author: template.author
            }
        })
        this.setState({templates: templates})
    }

    onLogOut(){
        this.setState({userId: null})
        window.history.replaceState({}, document.title)
    }

    createTemplate(){
        this.setState({ redirect: "/createTemplate"})
        
    }

    setRedirectToTemplateDetailView(e) {
        let id = e.target.id
        let redirectUrl = "/templateDetail/" + id
        this.setState({ redirect: redirectUrl, redirectTemplateId: id})
    }

    render(){
        if (this.state.redirect) {
            return <Redirect 
                        to={{
                            pathname : this.state.redirect,
                            state: {
                                userId: this.state.userId,
                                templateId: this.state.redirectTemplateId
                            }
                        }}
            />
        }
        return (
            <div className="home">
                <Navbar userId={this.state.userId} onLogOut={this.onLogOut} currentPage={"home"}/>   
                <Container  maxWidth="sm" className="gallery">
                <h1>Template Gallery</h1>
                <div id="grid-container">
                    {this.state.templates.map((t) => {
                        return <TemplateDisplayComponent 
                                    img={t.img}
                                    title={t.title}
                                    author={this.author}
                                    onClick={this.setRedirectToTemplateDetailView}
                                    id={t.id}
                                    key={t.id}
                                /> 
                    })}
                </div>
                </Container>
            </div>

        );
    }
}
export default Home;