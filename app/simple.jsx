//为了看看key属性到底怎么运作，写个简单的组件
import React from 'react';
require('../style/main.scss');
let arr = [
{
	key: 'k1',
	left: 100,
},
{
	key: 'k2',
	left: 400,
},
{
	key: 'k3',
	left: 800,
}];

export default class  App extends  React.Component {
	constructor(props) {
		super(props);
		this.state = {arr};
	}
	change(){
		let _arr = this.state.arr;
		[_arr[0],_arr[1]] = [_arr[1], _arr[0]];
		this.setState({arr: _arr});
	}
	render(){
		let temp = [];
		for(let i=0; i< this.state.arr.length; i++){
			let n = this.state.arr[i];
			let style = {
				position: 'absolute',
				left: (n.left)/(i+1),
			}
			temp.push(<h3 className="cancel-unit" style = {style} key={n.key}>{n.key}</h3>)
		}
		return (<div>
					<button onClick={this.change.bind(this)}>hhh</button>
					{temp}
				</div>)
	}
}