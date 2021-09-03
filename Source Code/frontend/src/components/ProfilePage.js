import { Component } from 'react';
import { Redirect } from "react-router-dom";
import React from "react";
import { Card, CardContent, Typography, Container} from '@material-ui/core';

import Navbar from './Navbar';
import TemplateDisplayComponent from './TemplateDisplayComponent';
import TierList from './TierList'

import '../css/ProfilePage.css';

class ProfilePage extends Component {

    constructor(props){
        super(props)

        this.setRedirectToTemplateDetailView = this.setRedirectToTemplateDetailView.bind(this)


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

    setRedirectToTemplateDetailView(e) {
        let id = e.target.id
        let redirectUrl = "/templateDetail/" + id
        this.setState({ redirect: redirectUrl, redirectTemplateId: id})
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
                <Container className="templateView" maxWidth="sm">
                    <h2>Created Templates</h2>
                    <hr id="seperator"/>
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
                <h2 style={{textAlign: "center"}}>Created Tier lists</h2>
                <hr id="seperator" style={{width: 50 + "%"}}/>
                {
					this.state.tierLists.map((tl) => { 
						return (
                            <Card key={tl.id} style={{backgroundColor: "#0f0f0f"}}>
                                <CardContent className="TemplateDetailView">
                                    <Typography variant="h5" component="h2">
                                        {tl.title}
                                    </Typography>
                                    <Typography style={{color:"grey"}} gutterBottom>
                                    By: {tl.author}
                                    </Typography>
                                    <TierList tiers={tl.tiers} key={tl.id}/>
                                </CardContent>
                            </Card>)
                        })
					.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))
				}
                </div>
        )
    }

}
export default ProfilePage