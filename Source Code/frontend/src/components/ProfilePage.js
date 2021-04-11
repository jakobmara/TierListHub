import { Component } from 'react';
import { Redirect } from "react-router-dom";
import React from "react";

import Navbar from './Navbar';
import TemplateDisplayComponent from './TemplateDisplayComponent';
import TierList from './TierList'

import '../css/ProfilePage.css';

class ProfilePage extends Component {

    constructor(props){
        super(props)
        console.log("profile page this:",this)
        this.state = {
            userId: this.props.match.params.userId,
            tierLists: [],
            templates: []
        }
        this.onLogOut = this.onLogOut.bind(this);

    }

    async componentDidMount(){

        let getTemplatesURL = "http://localhost:5000/getUserTemplates?userId=" + this.state.userId 

        let request = await fetch(getTemplatesURL)
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
        this.setState({templates: templates})

        let getTierListURL = "http://localhost:5000/getUserTierLists?userId=" + this.state.userId 

        let tierListsResponse  = await fetch(getTierListURL)
		let tierListJson = await tierListsResponse.json()
		const tierLists = await Promise.all(tierListJson.map(async (tl) => {
            let templateResponse = await fetch("http://localhost:5000/template/" + tl.templateId)
            let templateJson = await templateResponse.json()
			return {
				id: tl.id,
				key: tl.id,
				title: tl.title,
				author: tl.author,
				tiers: Object.keys(tl.rankings).map((tierId) => {
					return {
						id: tierId,
						key: tierId,
						tierName: templateJson.labels[tierId],
						items: tl.rankings[tierId].map((itemId) => {
							return {id: itemId, img: templateJson.items[itemId]}
						})
					}
				})
			}
		}))
		this.setState({ tierLists: tierLists })

    }

    onLogOut(){
		this.setState({userId: null})
        window.history.replaceState({}, document.title)
		this.setState({redirect: "/"})
	}

    render(){
        if (this.state.redirect) {
			return <Redirect to={{
				pathname : this.state.redirect,
				state: {userId : this.state.userId}
			}}/>
		}
        return (
            <div className="profilePage">
                <Navbar userId={this.state.userId} onLogOut={this.onLogOut}/>
                User profile page {this.state.userId}
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
                <div id="tierLists"> 
                <h3>tierLists</h3>
                {
					this.state.tierLists.map((tl) => { 
						return (
						<div>
							<h2>{tl.title}</h2>
							<p>{tl.author}</p>
							<TierList tiers={tl.tiers} key={tl.id}/>
						</div>)
					})
					.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))
				}
                </div>
                </div>
        )
    }

}
export default ProfilePage