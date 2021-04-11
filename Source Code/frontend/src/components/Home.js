import { Component } from 'react';
import React from "react";
import '../css/Home.css';
import Navbar from './Navbar';
import { Redirect } from "react-router-dom";
import TemplateDisplayComponent from './TemplateDisplayComponent';

class Home extends Component{

    constructor(props){  
        super(props);
        console.log("IN HOME CONSTRUCTOR")
        console.log(this.props.location)

        this.createTemplate = this.createTemplate.bind(this)
        this.onLogOut = this.onLogOut.bind(this);
        this.setRedirectToTemplateDetailView = this.setRedirectToTemplateDetailView.bind(this)


        var userId = null
        if (this.props.location.state != undefined && this.props.location.state.userId != undefined) {
            userId = this.props.location.state.userId
        }

        this.state = {
            userId: userId,
            templates: [],
            redirect: null
        }
        
    }
    async componentDidMount() {
        let requestUrl = 'http://localhost:5000/templates?page=1&size=20'
        let request = await fetch(requestUrl)
        let request_json = await request.json()
        console.log(request_json)
        let templates = request_json.map((template) => {
            return {
                id: template.id,
                title: template.title,
                img: template.img,
                author: template.author
            }
        })
        console.log(templates)
        this.setState({templates: templates})
    }

    onLogOut(){
        console.log("IN home logging out")
        this.setState({userId: null})
        window.history.replaceState({}, document.title)
    }

    createTemplate(){
        this.setState({ redirect: "/createTemplate"})
        
    }

    setRedirectToTemplateDetailView(e) {
        let id = e.target.id
        let redirectUrl = "/templateDetail/" + id
        console.log(e.target)
        this.setState({ redirect: redirectUrl, redirectTemplateId: id})
    }

    render(){
        if (this.state.redirect) {
            console.log("redirecting with state")
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
            <div >
                <Navbar userId={this.state.userId} onLogOut={this.onLogOut}/>   
                GALLERY
                <button onClick={this.createTemplate}>Create a template</button>
                <div>
                    {this.state.templates.map((t) => {
                        return <TemplateDisplayComponent 
                                    img={t.img}
                                    title={t.title}
                                    author={this.author}
                                    onClick={this.setRedirectToTemplateDetailView}
                                    id={t.id}
                                /> 
                    })}
                </div>
            </div>

        );
    }
}
export default Home;