import { Component } from 'react';
import './CreateTierList.css';

class CreateTierList extends Component {

	constructor(props) {
		super(props)
		this.tierlist = [
			<Tier tierName="S" id="1" items={[
				<TierItem position="1" tierId="1" id="1" handleDrag={this.handleDrag} handleDrop={this.handleDrop}/>,
				<TierItem position="1" tierId="1" id="2" handleDrag={this.handleDrag} handleDrop={this.handleDrop}/>]}/>,
			<Tier tierName="D" id="2" items={[
				<TierItem position="1" tierId="2" id="3" handleDrag={this.handleDrag} handleDrop={this.handleDrop}/>,
				<TierItem position="2" tierId="3" id="3" handleDrag={this.handleDrag} handleDrop={this.handleDrop}/>]}/>,
			<Tier tierName="F" id="3" items={[
				<TierItem position="1" tierId="3" id="4" handleDrag={this.handleDrag} handleDrop={this.handleDrop}/>,
				<TierItem position="2" tierId="3" id="5" handleDrag={this.handleDrag} handleDrop={this.handleDrop}/>]}/>,
		]
		this.handleDrag = this.handleDrag.bind(this);
		this.handleDrop = this.handleDrop.bind(this);
	}

	handleDrag(ev) {
		console.log(this)
		this.dragId = ev.currentTarget.id
		this.dragTierId = ev.currentTarget.tierId
	}

	handleDrop(ev) {
		var dragTierIndex = this.tierlist.findIndex((tier) => tier.id === this.dragTierId);
		var dropTierIndex = this.tierlist.findIndex((tier) => tier.id === ev.currentTarget.tierId);
		console.log("Drag Tier: " + this.tierlist[dragTierIndex].tierName)
		console.log("Drop Tier: " + this.tierlist[dragTierIndex].tierName)
		var dragItemIndex = this.tierlist[dragTierIndex].items.findIndex((item) => item.id === this.dragId);
		var dropItem = this.tierlist[dropTierIndex].items.findIndex((item) => item.id === ev.currentTarget.id);
	
		var dragItem = this.tierlist[dragTierIndex].items[dragItemIndex]
		this.tierlist[dragTierIndex].items.splice(dragItemIndex, 1)
		this.tierlist[dropTierIndex].items.push(dragItem)

		var dragItemPos = dragItem.position;
		var dropItemPos = dropItem.position;
		/*
		var newTierListState = this.tierlist.map((tier) => {
		  if (box.id === dragId) {
			box.order = dropBoxOrder;
		  }
		  if (box.id === ev.currentTarget.id) {
			box.order = dragBoxOrder;
		  }
		  return box;
		});
	
		this.tierlist = newTierListState
		*/
	  };

	render() {
		console.log(this.tierlist)
		return (
			<div className="CreateTierList">
				<div className="TierListContainer">
					{this.tierlist}		
				</div>
			</div>
		);
	}
}
	

const Tier = ({tierName, id, items}) => {
	return (
		<div className="Tier" id={id}>
			<h1 className="TierLabel">{tierName}</h1>
			<div className="TierContainer">
				{
				items
				}
			</div>
		</div>
	)
}


const TierItem = ({position, tierId, id, handleDrag, handleDrop}) => {
	return (
		<img
		tierId={tierId}
		id={id}
		position={position}
		className="TierItem"
		src="https://upload.wikimedia.org/wikipedia/en/a/a9/MarioNSMBUDeluxe.png"

		draggable={true}
		onDragOver={(ev) => ev.preventDefault()}
		onDragStart={handleDrag}
		onDrop={handleDrop}
		/>
	)
}

export default CreateTierList;
