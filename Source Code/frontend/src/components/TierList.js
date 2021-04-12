import { Component } from "react";
import { List } from '@material-ui/core/';

import Tier from './Tier'

import '../css/TierList.css'


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


    sortTiers(a, b) {
        var res = 0

        if (a.id === "-1") {
            return 1
        } else if (b.id === "-1") {
            return -1
        }

        if (a.id > b.id) {
            res = 1
        } else if (b.id > a.id) {
            res = -1
        }

        return res
    }

    render() {
        return (
            <List className="TierList">
                {
                this.state.tiers
                    .sort((a, b) => this.sortTiers(a, b))
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

                            onDeleteTier={this.props.onDeleteTier}
                            tierLabelListener={this.props.tierLabelListener}
                        />)
                    )
                }
        </List>
        )
        
    }
}

export default TierList