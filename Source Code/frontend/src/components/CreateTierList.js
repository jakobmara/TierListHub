import { Component } from 'react';
import Tier from './Tier.js'
import '../css/CreateTierList.css';

class CreateTierList extends Component {

	constructor(props) {
		super(props)

		this.handleDragOnItem = this.handleDragOnItem.bind(this);
		this.handleDropOnTier = this.handleDropOnTier.bind(this);
		
		this.getTierListStateFromTemplateId = this.getTierListStateFromTemplateId.bind(this)
		this.submitTierList = this.submitTierList.bind(this)

		this.state = {
			tierlist: [],
			userId: "1",
			templateId: "2",
			dragType: "",
			dragId: "-1",
			dragTierId: "-1"
		}

	}

	render() {
		return (
			<div className="CreateTierList">
				<button onClick={(e) => console.log(this.state)}>Debug</button>
				<div className="TierListContainer">
					{this.state.tierlist
						.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))
						.map((tier) => (
							<Tier
								id={tier.id}
								key={tier.id}
								tierName={tier.tierName}
								items={tier.items}
								isEditable={false}

								draggable={true}
								handleDragOnItem={this.handleDragOnItem}
								handleDropOnTier={this.handleDropOnTier}
							/>)
						)
					}
				</div>
				<button onClick={this.submitTierList}>Submit Template</button>
			</div>
		);
	}

	componentDidMount() {
		this.getTierListStateFromTemplateId()
	}

	async getTierListStateFromTemplateId() {
		const response = await fetch("http://localhost:5000/template/" + this.state.templateId)
		const templateJson = await response.json()
		console.log(templateJson)

		let tierLabels = JSON.parse(templateJson.labels)
		var tierList = Object.keys(tierLabels).map((tierId) => {
			return {id: tierId, tierName: tierLabels[tierId], items: []}
		})

		let unsortedItems = Object.keys(templateJson.items).map((itemId) => {
			return {id: itemId, img: templateJson.items[itemId]}
		})
		tierList.push({id: "-1", tierName: "Unsorted", items: unsortedItems})

		this.setState({tierlist: tierList})
	}

	submitTierList() {
		if (this.state.tierlist.find(tier => tier.id === "-1").items.length !== 0) {
			alert("hi")
			return
		}
		let tierListForRequest = this.state.tierlist.filter((tier) =>{
			return tier.id !== "-1"
		})

		let requestBody = {
			tierList: tierListForRequest,
			userId: this.state.userId,
			templateId: this.state.templateId,
			tierListName: "testTierListName",
		}

		let submitTemplateRequest = {
			method: 'POST',
			mode: 'cors',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(requestBody)
		}
		console.log(submitTemplateRequest)
		fetch("http://localhost:5000/uploadTierlist", submitTemplateRequest)
	}

	handleDragOnItem(ev) {
		this.setState({
			dragId: ev.currentTarget.id,
			dragTierId: ev.currentTarget.parentNode.id,
			dragType:"item"
		})

		console.log("In Item Drag")
		console.log("DragID: " + ev.currentTarget.id)
		console.log("DragTierID: " + ev.currentTarget.parentNode.id)
	}

	handleDropOnTier(ev) {
		console.log("Dropped On Tier")
		console.log("DropTierID: " + ev.currentTarget.id)

		switch(this.state.dragType) {
			case "item":
				this.setState({tierlist: this.handleItemDropOnTier(ev)})
				break
			case "tier":
				console.log("Dragged tier on tier")
				break		
			default:
				console.log("Got unknown drag and drop!")	
		}		
	  };

	handleItemDropOnTier(ev) {
		let dragId = this.state.dragId
		let dragTierId = this.state.dragTierId

		let dropTierId = ev.currentTarget.id

		let dragTier = this.state.tierlist.find((tier) => tier.id === dragTierId)
		const dragItem = dragTier.items.find((item) => item.id === dragId)

		let newTierListState = this.state.tierlist.map((tier) => {
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