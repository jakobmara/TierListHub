import { Component } from 'react';
import '../css/TemplateDisplayComponent.css';

class TemplateDisplayComponent extends Component{
    render() {
        return (
            <div className="templateContainer" onClick={this.props.onClick} id={this.props.id}>
                <img className="templateThumbnail"alt=""src={this.props.img} id={this.props.id}/>
                <h3 id={this.props.id}>{this.props.title}</h3>
                <p>{this.props.author}</p>
            </div>
        )
    }
}

export default TemplateDisplayComponent