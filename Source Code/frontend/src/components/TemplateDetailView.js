import { Component } from 'react';
import { Redirect } from "react-router-dom";

import Navbar from './Navbar'
import TierList from './TierList'

import '../css/TemplateDetailView.css';


class TemplateDetailView extends Component{

	constructor(props) {
		super(props)

		this.setRedirectToCreate = this.setRedirectToCreate.bind(this)

		this.state = {
			userId: this.props.location.state.userId,
			templateId: this.props.match.params.templateId,
			tierLists: []}
	}

	async componentDidMount() {
		let templateRequestUrl = "http://localhost:5000/template/" + this.state.templateId
		let templateResponse = await fetch(templateRequestUrl)
		let templateJson = await templateResponse.json()
		console.log(templateJson)

		this.setState({
			templateTitle: templateJson.templateName,
			templateAuthor: templateJson.author,
			templateImg: templateJson.img,
		})

		let tierListsRequestUrl = "http://localhost:5000/tierLists?templateId=" + this.state.templateId
		let tierListsResponse  = await fetch(tierListsRequestUrl)
		let tierListJson = await tierListsResponse.json()
		console.log(tierListJson)
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
		
		console.log(tierLists)
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
            <div className="TemplateDetailView">
				<Navbar userId={this.state.userId}/>

				<button onClick={(e) => console.log(this.state)}>Debug</button>
				<img alt="Template Thumbnail" src={this.state.templateImg} width="25%"/>
				<h1>{this.state.templateTitle}</h1>
				<p>{this.state.templateAuthor}</p>
				<button onClick={this.setRedirectToCreate}>Create a Tierlist from this Template</button>
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
        )
    }

} 
export default TemplateDetailView