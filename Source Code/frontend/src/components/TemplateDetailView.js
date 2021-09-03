import { Component } from 'react';
import { Redirect } from "react-router-dom";

import Navbar from './Navbar'
import TierList from './TierList'

import '../css/TemplateDetailView.css';
import { Card, CardContent, Typography, Container, Button} from '@material-ui/core';


class TemplateDetailView extends Component{

	constructor(props) {
		super(props)

		this.setRedirectToCreate = this.setRedirectToCreate.bind(this)

		this.state = {
			userId: this.props.location.state.userId,
			templateId: this.props.match.params.templateId,
			tierLists: []
		}

		document.body.style = 'background-color: #0f0f0f;';

	}

	async componentDidMount() {
		let templateRequestUrl = "http://localhost:5000/template/" + this.state.templateId
		let templateResponse = await fetch(templateRequestUrl)
		let templateJson = await templateResponse.json()

		this.setState({
			templateTitle: templateJson.templateName,
			templateAuthor: templateJson.author,
			templateImg: templateJson.img,
		})

		let tierListsRequestUrl = "http://localhost:5000/tierLists?templateId=" + this.state.templateId
		let tierListsResponse  = await fetch(tierListsRequestUrl)
		let tierListJson = await tierListsResponse.json()
		let tierLists = tierListJson.map((tl) => {

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
		})
		
		this.setState({ tierLists: tierLists })
	}


	setRedirectToCreate() {
		if (this.state.userId) {
			this.setState({ redirect : "/createTierList/" + this.state.templateId})
		} else {
			alert("You must log in to create Tier Lists")
		}
	}


    render(){
		if (this.state.redirect) {
			return <Redirect 
                        to={{
                            pathname : this.state.redirect,
                            state: {
                                userId: this.state.userId,
                                templateId: this.state.templateId
                            }
                        }}
            />
		}

        return(
			<div className="DetailPaper"> 
                <Navbar userId={this.state.userId} onLogOut={this.onLogOut} currentPage={"tempDetailView"}/>   
				<Container className="templateDisplay" width="sm">
				<h1>{this.state.templateTitle}</h1>

				<img alt="Template Thumbnail" src={this.state.templateImg} width="25%"/>
				<p>By: {this.state.templateAuthor}</p>
				<Button variant="outlined" color="primary" className="login-btn" onClick={this.setRedirectToCreate}>Create a Tierlist from this Template</Button>

				</Container>
				<div style={{textAlign:"center"}}>
				</div>
				<div maxWidth="sm" className="tierLists">
				<br/>
				<br/>
				<h2>TierLists based on template</h2>
				<hr style={{width:50 +"%"}}/>
				{
					this.state.tierLists.map((tl) => { 
						return (
						<Card style={{backgroundColor: "#0f0f0f"}}>
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
			</div>
				
        )
    }

} 
export default TemplateDetailView