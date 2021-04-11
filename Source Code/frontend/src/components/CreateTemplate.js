import { Component } from 'react';
import Tier from './Tier.js'
import TemplateDialogForm from './TemplateDialogForm'
import '../css/CreateTemplate.css';
import Navbar from './Navbar';
import { Redirect } from "react-router-dom";

class CreateTemplate extends Component {

	constructor(props) {
		super(props)

		this.tierLabelListener = this.tierLabelListener.bind(this);
		this.handleDragOnItem = this.handleDragOnItem.bind(this);
		this.handleDropOnTier = this.handleDropOnTier.bind(this);
		
		this.onLogOut = this.onLogOut.bind(this);
		this.deleteItem = this.deleteItem.bind(this)
		this.addNewTierItem = this.addNewTierItem.bind(this)
		this.addNewTier = this.addNewTier.bind(this)
		this.onDeleteTier = this.onDeleteTier.bind(this)

		this.submitTemplate = this.submitTemplate.bind(this)

		this.state = {
			tierlist: [
				{id: "1", tierName: "S", items: []},
				{id: "2", tierName: "A", items: []},
				{id: "3", tierName: "B", items: []},
				{id: "4", tierName: "C", items: []},
				{id: "5", tierName: "D", items: []},
				{id: "6", tierName: "F", items: []},
				{id: "-1", tierName: "Unsorted", items: []}
			],
			userId: this.props.location.state.userId,
			dragType: "",
			dragId: "-1",
			dragTierId: "-1"
		}
	}

	onLogOut(){
		this.setState({userId: null})
        window.history.replaceState({}, document.title)
		this.setState({redirect: "/"})
	}

	render() {
		if (this.state.redirect) {
			return <Redirect to={{
				pathname : this.state.redirect,
				state: {userId : this.state.userId}
			}}/>
		}
		
		return (
			<div className="CreateTierList">
				<Navbar userId={this.state.userId} onLogOut={this.onLogOut}/>

				<button onClick={(e) => console.log(this)}>Debug</button>
				
				<div className="TierListContainer">
					{this.state.tierlist
						.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))
						.map((tier) => (
							<Tier
								id={tier.id}
								key={tier.id}
								tierName={tier.tierName}
								items={tier.items}
								isEditable={true}
								tierLabelListener={this.tierLabelListener}
								onDeleteTier={this.onDeleteTier}

								draggable={true}
								handleDragOnItem={this.handleDragOnItem}
								handleDropOnTier={this.handleDropOnTier}
							/>)
						)
					}
				</div>
				<div className="AddNewItemContainer">
					<input 
						type="file"
						onChange={this.addNewTierItem}
					/>
					<img
						src="https://static.thenounproject.com/png/1237-200.png"
						onDragOver={(ev) => ev.preventDefault()}
						onDrop={this.deleteItem}
						alt=""
					/>
					<button onClick={this.addNewTier}>Add New Tier</button>
				</div>
				<TemplateDialogForm submitTemplate={this.submitTemplate}/>
			</div>
		);
	}


	submitTemplate(dialogFormState) {

		let templateTitle = dialogFormState.templateName
		let tierListName = dialogFormState.tierListName
		let templateImage = dialogFormState.thumbnailBlob



		let tierListForRequest = this.state.tierlist.filter((tier) =>{
			return tier.id !== "-1"
		})

		let requestBody = {
			tierList: tierListForRequest,
			userId: this.state.userId,
			templateTitle: templateTitle,
			templateImage: templateImage,
			tierListName: tierListName,

		}

		let submitTemplateRequest = {
			method: 'POST',
			mode: 'cors',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(requestBody)
		}
		console.log(submitTemplateRequest)
		fetch("http://localhost:5000/uploadTemplate", submitTemplateRequest)
		
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


	async addNewTierItem(ev) {
		let file = URL.createObjectURL(ev.target.files[0])
		var maxId = 0
		for (const tier in this.state.tierlist) {
			for (const item in this.state.tierlist[tier].items) {
				if (this.state.tierlist[tier].items[item].id > maxId) {
					maxId = this.state.tierlist[tier].items[item].id
				}
			}
		}

		const blob = await fetch(file).then(r => r.blob())

		const b64Img = await new Promise((resolve, reject) => {
						const reader = new FileReader();
		
						reader.onloadend = res => {
							resolve(res.target.result);
						};
						reader.onerror = err => reject(err);
					
						reader.readAsDataURL(blob);
					});
		
		let newItem = {id: String(parseInt(maxId) + 1), position: 99, img: file, b64Img: b64Img}

		const newTierListState = this.state.tierlist.map((tier) => {
			if (tier.id === "-1") {
				tier.items.push(newItem)
			}
			return tier
		})

		this.setState({tierlist: newTierListState})
	}


	deleteItem(ev) {
		let dragId = this.state.dragId
		let dragTierId = this.state.dragTierId

		let newTierListState = this.state.tierlist.map((tier) => {
			if (tier.id === dragTierId) {
				let tierItemIndex = tier.items.findIndex((tierItem) => tierItem.id === dragId)
				tier.items.splice(tierItemIndex, 1)
			}

			return tier
		})

		
		this.setState({tierlist: newTierListState})
	}

	addNewTier(ev) {
		var maxId = 0
		for (const tier in this.state.tierlist) {
			if (this.state.tierlist[tier].id > maxId) {
				maxId = this.state.tierlist[tier].id
			}
		}

		let newTier = {id: String(parseInt(maxId) + 1), position: 99, items: []}

		var newTierListState = this.state.tierlist
		newTierListState.push(newTier)

		this.setState({tierlist: newTierListState})
	}

	onDeleteTier(ev) {
		let deleteTierId = ev.target.parentNode.id

		var newTierListState = this.state.tierlist.slice()
		newTierListState.splice(newTierListState.findIndex((tier) => tier.id === deleteTierId), 1)

		let itemsInDeletedTier = this.state.tierlist.find((tier) => tier.id === deleteTierId).items 
		let newUnsortedItems = newTierListState.find((tier) => tier.id === "-1").items.concat(itemsInDeletedTier)
		
		newTierListState.find((tier) => tier.id === "-1").items = newUnsortedItems

		this.setState({tierlist: newTierListState})
	}

	tierLabelListener(ev) {
		let editedTierId = ev.target.parentNode.id
		let newTierName = ev.target.value

		let newTierListState = this.state.tierlist.map((tier) => {
			if (tier.id === editedTierId) {
				tier.tierName = newTierName
			}
			return tier
		})

		this.setState({tierlist: newTierListState})
	}
		
}

export default CreateTemplate;