import { Component } from 'react';
import '../CreateTierList.css';

class CreateTierList extends Component {

	constructor(props) {
		super(props)

		this.handleDrag = this.handleDrag.bind(this);
		this.handleDropOnTier = this.handleDropOnTier.bind(this);
		this.deleteItem = this.deleteItem.bind(this)
		
		this.addNewTierItem = this.addNewTierItem.bind(this)

		let defaultImg = "https://upload.wikimedia.org/wikipedia/en/a/a9/MarioNSMBUDeluxe.png"

		this.state = {
			tierlist: [
				{id: "1", tierName: "S", items: [
					{id: "1", position: 1, img: defaultImg}, {id: "2", position: 2, img: defaultImg}]
				},
				{id: "2", tierName: "D", items: [
					{id: "3", position: 1, img: defaultImg}, {id: "4", position: 2, img: defaultImg}]
				},
				{id: "3", tierName: "F", items: [
					{id: "5", position: 1, img: defaultImg}, {id: "6", position: 2, img: defaultImg}]
				},
				{id: "-1", tierName: "Unsorted", items: []}
			],
			userId: "1",
			dragId: "-1",
			dragTierId: "-1"
		}
	}

	componentDidMount() {
		this.getTemplateId()
	}

	getTemplateId() {
		let getTemplateRequest = {
			method: 'GET',
			mode: 'cors',
			cache: 'default',
		}
		
		fetch("http://localhost:5000/getTemplateId?userId=" + this.state.userId, getTemplateRequest)
			.then(res => res.json())
			.then(res => this.setState({templateId: res.templateId}))
	}

	handleDrag(ev) {
		this.setState({
			dragId: ev.currentTarget.id,
			dragTierId: ev.currentTarget.parentNode.id
		})
		console.log("In Drag")
		console.log("DragID: " + ev.currentTarget.id)
		console.log("DragTierID: " + ev.currentTarget.parentNode.id)
	}


	handleDropOnTier(ev) {
		console.log("Dropped On Tier")
		console.log("DropTierID: " + ev.currentTarget.id)

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
		console.log(newTierListState)
		
		this.setState({tierlist: newTierListState})
	  };


	addNewTierItem(ev) {
		let file = URL.createObjectURL(ev.target.files[0])
		var maxId = 0
		for (const tier in this.state.tierlist) {
			for (const item in this.state.tierlist[tier].items) {
				if (this.state.tierlist[tier].items[item].id > maxId) {
					maxId = this.state.tierlist[tier].items[item].id
				}
			}
		}

		let newItem = {id: String(parseInt(maxId) + 1), position: 99, img: file}

		const newTierListState = this.state.tierlist.map((tier) => {
			if (tier.id === "-1") {
				tier.items.push(newItem)
			}
			return tier
		})

		this.setState({tierlist: newTierListState})
	}


	deleteItem(ev) {
		console.log("Deleting")
		let dragId = this.state.dragId
		let dragTierId = this.state.dragTierId

		let newTierListState = this.state.tierlist.map((tier) => {
			if (tier.id === dragTierId) {
				let tierItemIndex = tier.items.findIndex((tierItem) => tierItem.id === dragId)
				tier.items.splice(tierItemIndex, 1)
			}

			return tier
		})

		console.log(newTierListState)
		
		this.setState({tierlist: newTierListState})

	  }

	render() {
		return (
			<div className="CreateTierList">
				<button onClick={(e) => console.log(this.state)}>Debug</button>
				<div className="TierListContainer">
				<div className="Tier">
						<h1 className="TierLabel"><input></input></h1>
						<div className="TierContainer"></div>
				</div>

					{this.state.tierlist.map((tier) => (
						<Tier
							id={tier.id}
							tierName={tier.tierName}
							items={tier.items}
							handleDrag={this.handleDrag}
							handleDropOnTier={this.handleDropOnTier}
						/>)
					)}
				</div>
				<div className="AddNewItemContainer">
					<input 
						type="file"
						name="file"
						onChange={this.addNewTierItem}
					/>
					<img
						src="https://static.thenounproject.com/png/1237-200.png"
						onDragOver={(ev) => ev.preventDefault()}
						onDrop={(ev) => this.deleteItem(ev)}
						alt=""
					/>
				</div>
			</div>
		);
	}
}
	

const Tier = ({tierName, id, items, handleDrag, handleDropOnItem, handleDropOnTier}) => {
	return (
		<div className="Tier" 
			id={id} 
			onDrop={handleDropOnTier}
			onDragOver={(ev) => ev.preventDefault()}>
			
			<h1 className="TierLabel">{tierName}</h1>
			<div className="TierContainer" id={id}>
				{items.map((tierItem) => (
					<TierItem
						id={tierItem.id}
						position={tierItem.position}
						tierid={id}
						handleDrag={handleDrag}
						handleDrop={handleDropOnItem}
						img={tierItem.img}
					/>)
				)}
			</div>
		</div>
	)
}


const TierItem = ({id, tierid, position, handleDrag, img}) => {
	return (
		<img
			id={id}
			tierid={tierid}
			position={position}
			className="TierItem"
			src={img}
			alt=""

			draggable={true}
			onDragStart={handleDrag}
		/>
	)
}

export default CreateTierList;