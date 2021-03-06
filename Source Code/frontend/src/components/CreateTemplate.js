import { Component } from 'react';
import TierList from './TierList.js'
import TemplateDialogForm from './TemplateDialogForm'
import '../css/CreateTemplate.css';
import Navbar from './Navbar';
import { Redirect } from "react-router-dom";
import { Button } from '@material-ui/core';
 
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
			dragTierId: "-1",
			itemIdCounter: 0,
			tierIdCounter: 7,
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
			<div className="CreateTemplate">
				<Navbar userId={this.state.userId} onLogOut={this.onLogOut} currentPage={""}/>

				<br/>
				<br/>
				
				<div className="TierListContainer">
				<TierList 
						tiers={this.state.tierlist}
						isEditable={true}
						tierLabelListener={this.tierLabelListener}
						onDeleteTier={this.onDeleteTier}

						draggable={true}
						handleDragOnItem={this.handleDragOnItem}
						handleDropOnTier={this.handleDropOnTier}
					/>
					<div className="Tier" style={{textAlign:"right", overflow:"auto"}}>
					<Button variant="outlined" color="inherit" onClick={this.addNewTier}>Add New Tier</Button>

						<input 
							type="file"
							accept="image/*"
							onChange={this.addNewTierItem}
						/>

						<img
							src="https://static.thenounproject.com/png/1237-200.png"
							onDragOver={(ev) => ev.preventDefault()}
							onDrop={this.deleteItem}
							alt=""
							className="trash"
							style={{float:"right"}}
						/>
					</div>
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
		fetch("http://localhost:5000/uploadTemplate", submitTemplateRequest)
		.then((r) => {
			if (r.ok) {
				alert("Template submitted succesfully")
				this.setState({ redirect: "/"})
			} else {
				alert("Error submitting template")
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
				this.setState({tierlist: this.handleItemDropOnTier(ev)})
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
		if (ev.target.files.length === 0) {
			return
		}

		let file = URL.createObjectURL(ev.target.files[0])

		var maxId = this.state.itemIdCounter
		this.setState({itemIdCounter: maxId + 1})


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
		let maxId = this.state.tierIdCounter
		this.setState({tierIdCounter: maxId + 1})

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
		let editedTierId = ev.target.id
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