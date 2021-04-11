import { Component } from 'react';
import '../css/TemplateDisplayComponent.css';

class TemplateDisplayComponent extends Component{
    render() {
        return (
            <div className="templateContainer" onClick={this.props.onClick}>
                <img className="templateThumbnail"alt=""src={this.props.img}/>
                <h3>{this.props.title}</h3>
                <p>{this.props.author}</p>
            </div>
        )
    }
}

export default TemplateDisplayComponent