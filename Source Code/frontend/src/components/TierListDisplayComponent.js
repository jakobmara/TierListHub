import { Component } from 'react';

class TierListDisplayComponent extends Component{
    render() {
        <div onClick={this.props.onClick}>
            <img alt=""src={this.props.thumbnail}/>
            <h3>{this.props.title}</h3>
            <p>{this.props.username}</p>
        </div>
    }
}

export default TierListDisplayComponent