import { Component } from 'react';
import { Redirect } from "react-router-dom";

import TierList from './TierList.js'
import Navbar from './Navbar'
import Button from '@material-ui/core/Button';

import '../css/CreateTierList.css';

class CreateTierList extends Component {

	constructor(props) {
		super(props)

		this.handleDragOnItem = this.handleDragOnItem.bind(this);
		this.handleDropOnTier = this.handleDropOnTier.bind(this);
		
		this.getTierListStateFromTemplateId = this.getTierListStateFromTemplateId.bind(this)
		this.submitTierList = this.submitTierList.bind(this)

		this.state = {
			tiers: [],
			userId: this.props.location.state.userId,
			templateId: this.props.match.params.templateId,
			dragType: "",
			dragId: "-1",
			dragTierId: "-1"
		}

	}

	render() {
		if (this.state.redirect) {
			return <Redirect 
						to={{
							pathname : this.state.redirect,
							state: {
								userId: this.state.userId,
							}
						}}
					/>
		}
		return (
			<div>
				<Navbar userId={this.state.userId}/>
				<div className="CreateTierList">
				<br/>
				<br/>					
				<TierList 
						tiers={this.state.tiers}
						isEditable={false}
						draggable={true}
						handleDragOnItem={this.handleDragOnItem}
						handleDropOnTier={this.handleDropOnTier}
					/>
				<Button variant="outlined" color="primary" className="login-btn" onClick={this.submitTierList}>Create Tierlist</Button>
				</div>
			</div>
			
		);
	}

	componentDidMount() {
		this.getTierListStateFromTemplateId()
	}

	async getTierListStateFromTemplateId() {
		const response = await fetch("http://localhost:5000/template/" + this.state.templateId)
		const templateJson = await response.json()

		let tierLabels = templateJson.labels
		var tiers = Object.keys(tierLabels).map((tierId) => {
			return {id: tierId, tierName: tierLabels[tierId], items: []}
		})

		let unsortedItems = Object.keys(templateJson.items).map((itemId) => {
			return {id: itemId, img: templateJson.items[itemId]}
		})
		tiers.push({id: "-1", tierName: "Unsorted", items: unsortedItems})

		this.setState({tiers: tiers})
	}

	submitTierList() {
		if (this.state.tiers.find(tier => tier.id === "-1").items.length !== 0) {
			alert("All items must be sorted before submitting a Tierlist")
			return
		}

		let tierListName = prompt("Tierlist Title:")
		if (tierListName === "") {
			alert("A title must be provided to submit a Tierlist")
			return	
		} else if (tierListName === null) {
			return
		}

		let tierListForRequest = this.state.tiers.filter((tier) =>{
			return tier.id !== "-1"
		})

		let requestBody = {
			tierList: tierListForRequest,
			userId: this.state.userId,
			templateId: this.state.templateId,
			tierListName: tierListName,
		}

		let submitTemplateRequest = {
			method: 'POST',
			mode: 'cors',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(requestBody)
		}
		fetch("http://localhost:5000/uploadTierlist", submitTemplateRequest)
		.then((r) => {
				if (r.ok) {
					alert("Tierlist succesfully submitted")
					this.setState({ redirect: '/'})
				} else {
					alert("Error submitting.")
				}
			})
	}

	handleDragOnItem(ev) {
		this.setState({
			dragId: ev.currentTarget.id,
			dragTierId: ev.currentTarget.parentNode.id,
			dragType:"item"
		})

	}

	handleDropOnTier(ev) {

		switch(this.state.dragType) {
			case "item":
				this.setState({tiers: this.handleItemDropOnTier(ev)})
				break
			case "tier":
				break		
			default:
				console.log("Got unknown drag and drop!")	
		}		
	  };

	handleItemDropOnTier(ev) {
		let dragId = this.state.dragId
		let dragTierId = this.state.dragTierId

		let dropTierId = ev.currentTarget.id

		let dragTier = this.state.tiers.find((tier) => tier.id === dragTierId)
		const dragItem = dragTier.items.find((item) => item.id === dragId)

		let newTierListState = this.state.tiers.map((tier) => {
			if (tier.id === dragTierId) {
				let tierItemIndex = tier.items.findIndex((tierItem) => tierItem.id === dragId)
				tier.items.splice(tierItemIndex, 1)
			}
			if (tier.id === dropTierId) {
				tier.items.push(dragItem)
			}
			return tier
		})

		return newTierListState
	}
	
}

export default CreateTierList;