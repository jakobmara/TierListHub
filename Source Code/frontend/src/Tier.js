import React from 'react'
import TierItem from './TierItem.js'

class Tier extends React.Component {

    render() {
        var tierNameLabel = <h1 className="TierLabel">{this.props.tierName}</h1>
        var deleteButton = null
        // This is a unsorted tier
        if (this.props.isEditable && this.props.id !== "-1") {
                tierNameLabel = <input 
                                    type="text" 
                                    value={this.props.tierName} 
                                    onChange={this.props.tierLabelListener}
                                    style={{textAlign: "center"}}/>
                deleteButton = <button style={{float: "right"}} onClick={this.props.onDeleteTier}>Delete</button>
        }
        let tierHeight = "64px"

        return (
            <div className="Tier"
                style={{minHeight: tierHeight}}
                id={this.props.id}
    
                onDrop={this.props.handleDropOnTier}
                onDragOver={(ev) => ev.preventDefault()}>
                
                {tierNameLabel}
                <div className="TierContainer" id={this.props.id}>
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
                {deleteButton}
            </div>
        )
    }
}

export default Tier