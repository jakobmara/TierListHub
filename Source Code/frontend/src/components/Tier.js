import React from 'react'
import TierItem from './TierItem.js'
import Button from '@material-ui/core/Button';

import '../css/TierList.css'


class Tier extends React.Component {

    render() {
        var tierNameLabel = <h1 className="TierLabel">{this.props.tierName}</h1>
        var deleteButton = null
        // This is a unsorted tier
        if (this.props.isEditable && this.props.id !== "-1") {
                tierNameLabel = <input 
                                    className="EditableTierLabel"
                                    type="text" 
                                    value={this.props.tierName} 
                                    onChange={this.props.tierLabelListener}/>
                deleteButton = <button className="DeleteTierButton" onClick={this.props.onDeleteTier}>Delete</button>
        }

        return (
            <div className="Tier"
                id={this.props.id}
    
                onDrop={this.props.handleDropOnTier}
                onDragOver={(ev) => ev.preventDefault()}>
                {deleteButton}
                <div className="TierLabel">
                    {tierNameLabel}
                </div>
                <div className="TierItems" id={this.props.id}>
                    {this.props.items.map((tierItem) => (
                        <TierItem
                            id={tierItem.id}
                            key={tierItem.id}
                            tierid={this.props.id}
                            position={tierItem.position}
                            img={tierItem.img}
    
                            draggable={this.props.draggable}
                            handleDrag={this.props.handleDragOnItem}
                            handleDrop={this.props.handleDropOnItem}
                        />)
                    )}
                </div>
            </div>
        )
    }
}

export default Tier