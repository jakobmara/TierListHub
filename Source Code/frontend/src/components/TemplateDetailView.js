import { Component } from 'react';
import Navbar from './Navbar'
import TierList from './TierList'

class TemplateDetailView extends Component{

	constructor(props) {
		super(props)
		console.log(this)
		this.state = {
			templateId: this.props.match.params.templateId,
			tierLists: []}
	}

	async componentDidMount() {
		let templateRequestUrl = "http://localhost:5000/template/" + this.state.templateId
		let templateResponse = await fetch(templateRequestUrl)
		let templateJson = await templateResponse.json()
		console.log(templateJson)


		let tierListsRequestUrl = "http://localhost:5000/tierLists?templateId=" + this.state.templateId
		let tierListsResponse  = await fetch(tierListsRequestUrl)
		let tierListJson = await tierListsResponse.json()
		console.log(tierListJson)
		let tierLists = tierListJson.map((tl) => {

			return {
				id: tl.id,
				key: tl.id,
				title: tl.title,
				author: tl.author,
				tiers: Object.keys(tl.rankings).map((tierId) => {
					return {
						id: tierId,
						key: tierId,
						tierName: templateJson.labels[tierId],
						items: tl.rankings[tierId].map((itemId) => {
							return {id: itemId, img: templateJson.items[itemId]}
						})
					}
				})
			}
		})

		console.log(tierLists)
		this.setState({ tierLists: tierLists })
	}

    render(){
        return(
            <div className="CreateTierList">
				<Navbar/>

				<button onClick={(e) => console.log(this.state)}>Debug</button>
				{
					this.state.tierLists.map((tl) => { 
						return (
						<div>
							<h2>{tl.title}</h2>
							<p>{tl.author}</p>
							<TierList tiers={tl.tiers} key={tl.id}/>
						</div>)
					})
					.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))
				}			
			</div>
        )
    }

} 
export default TemplateDetailView