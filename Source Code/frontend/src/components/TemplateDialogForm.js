import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class TempalteDialogForm extends Component {

	constructor(props) {
		super(props)

		this.handleClickOpen = this.handleClickOpen.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleClose = this.handleClose.bind(this)
		this._handleTextFieldChange = this._handleTextFieldChange.bind(this)

		this.addThumbnail = this.addThumbnail.bind(this)
		
		this.state = {
			open: false,
			hasThumbnail: false,
			thumbnailUrl: null,
			thumbnailBlob: null
		}
	}

	handleClickOpen() {
		this.setState({open: true})
	}

	handleSubmit() {
		console.log("submitted")
		this.props.submitTemplate(this.state)
		this.handleClose()
	}

	handleClose() {
		this.setState({open: false})
		console.log(this)
	};

	_handleTextFieldChange(ev) {
		switch(ev.target.id) {
			case "templateName":
				this.setState({templateName: ev.target.value})
				break
			case "tierListName":
				this.setState({tierListName: ev.target.value})
				break
			default:
				break;
		}
	}

	async addThumbnail(ev) {
		let file = URL.createObjectURL(ev.target.files[0])

		this.setState({thumbnailUrl: file, hasThumbnail: true})

		const blob = await fetch(file).then(r => r.blob())
		const b64Img = await new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.onloadend = res => {
				//console.log(res.target.result)
				resolve(res.target.result);
			};
			reader.onerror = err => reject(err);
		
			reader.readAsDataURL(blob);
		});
		this.setState({thumbnailBlob: b64Img}) 
	}

	render() {
		return (
			<div>
				<Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
					Submit Template
				</Button>
				<Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">Submit Tierlist Template</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Select an Image to be used as the thumbnail for this Tierlist Template
						</DialogContentText>
						<div>
							<img src={this.state.thumbnailUrl} width="128px" height="128px"/>
							<Button variant="contained" component="label">
								Choose Image
								<input type="file" hidden onChange={this.addThumbnail}/>
							</Button>
						</div>
						
						<DialogContentText>
							Please enter a title for this template that describes the theme of the items in the Tierlist.
						</DialogContentText>
						<TextField
							autoFocus
							id="templateName"
							label="Template Title"
							type="text"
							fullWidth
							value={this.state.textFieldValue}
							onChange={this._handleTextFieldChange}
						/>
						<DialogContentText>
							Please enter a title for your Tierlist.
						</DialogContentText>
						<TextField
							autoFocus
							id="tierListName"
							label="Tierlist Title"
							type="text"
							fullWidth
							value={this.state.textFieldValue}
							onChange={this._handleTextFieldChange}
						/>
					</DialogContent>
					<DialogActions>
					<Button onClick={this.handleClose} color="primary">
						Cancel
					</Button>
					<Button onClick={this.handleSubmit} color="primary">
						Submit
					</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
  
}


export default TempalteDialogForm