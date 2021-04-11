import { Component } from "react";
import Tier from './Tier'


class TierList extends Component {
    
    constructor(props) {
        super(props)
        
        this.state = {
            tiers: this.props.tiers
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ tiers: nextProps.tiers });  
    }

    render() {
        console.log("Rendering TierList")
        return (
            <div className="TierListContainer">
                {
                this.state.tiers
                    .sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))
                    .map((tier) => (
                        <Tier
                            id={tier.id}
                            key={tier.id}
                            tierName={tier.tierName}
                            items={tier.items}
                            isEditable={this.props.isEditable}

                            draggable={true}
                            handleDragOnItem={this.props.handleDragOnItem}
                            handleDropOnTier={this.props.handleDropOnTier}
                        />)
                    )
                }
        </div>
        )
        
    }
}

export default TierList