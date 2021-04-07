import { Component } from 'react';
import './CreateTierList.css';

class CreateTierList extends Component {

	constructor(props) {
		super(props)

		this.handleDrag = this.handleDrag.bind(this);
		this.handleDropOnItem = this.handleDropOnItem.bind(this);
		this.handleDropOnTier = this.handleDropOnTier.bind(this);


		this.state = {
			tierlist: [
				{id: "1", tierName: "S", items: [
					{id: "1", position: 1}, {id: "2", position: 2}]
				},
				{id: "2", tierName: "D", items: [
					{id: "3", position: 1}, {id: "4", position: 2}]
				},
				{id: "3", tierName: "F", items: [
					{id: "5", position: 1}, {id: "6", position: 2}]
				},
				{id: "-1", tierName: "Unsorted", items: []}
			],
			unsortedItems: [],
			dragId: "-1",
			dragTierId: "-1"
		}
	}

	handleDrag(ev) {
		this.setState({
			dragId: ev.currentTarget.id,
			dragTierId: ev.currentTarget.parentNode.id
		})
		console.log(ev.currentTarget)
		console.log("In Drag")
		console.log("DragID: " + ev.currentTarget.id)
		console.log("DragTierID: " + ev.currentTarget.parentNode.id)
	}

	handleDropOnItem(ev) {
		console.log("Dropped on Item")
		console.log("DropID: " + ev.currentTarget.id)
		console.log("DropTierID: " + ev.currentTarget.parentNode.id)
		
		let dragId = this.state.dragId
		let dragTierId = this.state.dragTierId
		
		let dropId = ev.currentTarget.id
		let dropTierId = ev.currentTarget.parentNode.id

		let dragTier = this.state.tierlist.find((tier) => tier.id === dragTierId)
		let dragItem = dragTier.items.find((item) => item.id == dragId)
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

	  handleDropOnTier(ev) {
		console.log("Dropped On Tier")
		console.log("DropTierID: " + ev.currentTarget.id)
		
		let dragId = this.state.dragId
		let dragTierId = this.state.dragTierId
		
		let dropTierId = ev.currentTarget.id

		let dragTier = this.state.tierlist.find((tier) => tier.id === dragTierId)
		let dragItem = dragTier.items.find((item) => item.id === dragId)
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

	  addNewTierItem() {
		  alert("Gotcha")
	  }

	render() {
		return (
			<div className="CreateTierList">
				<div className="TierListContainer">
					{this.state.tierlist.map((tier) => (
						<Tier
							id={tier.id}
							tierName={tier.tierName}
							items={tier.items}
							handleDrag={this.handleDrag}
							handleDropOnItem={this.handleDropOnItem}
							handleDropOnTier={this.handleDropOnTier}
						/>)
					)}
				</div>
				<button onClick={this.addNewTierItem}>
					Add New Item
				</button>
			</div>
		);
	}
}
	

const Tier = ({tierName, id, items, handleDrag, handleDropOnItem, handleDropOnTier}) => {
	return (
		<div className="Tier" id={id} onDrop={handleDropOnTier} onDragOver={(ev) => ev.preventDefault()}>
			<h1 className="TierLabel">{tierName}</h1>
			<div className="TierContainer" id={id}>
				{items.map((tierItem) => (
					<TierItem
						id={tierItem.id}
						position={tierItem.position}
						tierid={id}
						handleDrag={handleDrag}
						handleDrop={handleDropOnItem}
					/>)
				)}
			</div>
		</div>
	)
}


const TierItem = ({id, tierid, position, handleDrag, handleDrop}) => {
	return (
		<img
		id={id}
		tierid={tierid}
		position={position}
		className="TierItem"
		src="https://upload.wikimedia.org/wikipedia/en/a/a9/MarioNSMBUDeluxe.png"
		alt=""

		draggable={true}
		//onDragOver={(ev) => ev.preventDefault()}
		onDragStart={handleDrag}
		//onDrop={handleDrop}
		/>
	)
}

export default CreateTierList;