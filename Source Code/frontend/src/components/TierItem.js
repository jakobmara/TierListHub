import React from "react";

class TierItem extends React.Component {
    render() {
        return (
            <img
                id={this.props.id}
                tierid={this.props.tierid}
                position={this.props.position}
                className="TierItem"
                src={this.props.img}
                alt=""
    
                draggable={this.props.draggable}
                onDragStart={this.props.handleDrag}
            />
        )
    }
}

export default TierItem;