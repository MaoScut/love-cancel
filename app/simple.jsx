//为了看看key属性到底怎么运作，写个简单的组件
import React from 'react';
import uuid from 'uuid';
require('../style/main.scss');
let arr = [
{
	key: uuid.v4(),
	left: 100,
	top:50,
},
{
	key: uuid.v4(),
	left: 400,
	top:80,
},
{
	key: uuid.v4(),
	left: 800,
	top:110,
}];
let obj = {};
arr.forEach(v=>{
	obj[v.key] = {
		left:v.left,
		top: v.top,
	}
})
export default class  App extends  React.Component {
	constructor(props) {
		super(props);
		this.state = {obj};
	}
	change(){
		[arr[0], arr[1]] = [arr[1], arr[0]];
		arr.forEach((v,i)=>{
		obj[v.key] = {
				left:v.left/(i+1),
				top: v.top,
			}
		})
		this.setState({obj});
	}
	render(){
		let temp = [];
		for(let k in this.state.obj){

			let n = this.state.obj[k];
			let style = {
				position: 'absolute',
				left: n.left,
				top: n.top,
			}
			temp.push(<h3 className = 'cancel-unit' style = {style} key={k}>{k}</h3>)
		}
		return (<div>
					<button onClick={this.change.bind(this)}>change</button>
						{temp}					
				</div>)
	}
}
// var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
//     // var React = require('react');
//     // var ReactDOM = require('react-dom');
//     var data = ['one','two','three'];
// export default React.createClass({
//         getInitialState:function(){
//             return {
//                 'items': data
//             }
//         },
//         addItem:function(){
//             var newItems = this.state.items.concat('four','five');
//             this.setState({
//                 'items':newItems
//             });
//         },
//         removeItem:function(i){
//             var newItems = this.state.items;
//             newItems.splice(i,1);
//             this.setState({
//                 'items':newItems
//             });
//         },
//         render:function(){
//             var $this = this;
//             //debugger;
//             var List = this.state.items.map(function(value,index){
//                 return <div key={value} onClick = {$this.removeItem.bind($this,index)}> { value}</div>
//             });
//             return (
//                 <div>
//                     <button onClick={this.addItem}>add Item</button>
//                     <ReactCSSTransitionGroup
//                         transitionName='example'
//                         transitionEnterTimeout={500}
//                         transitionLeaveTimeout={300}>
//                         {List}
//                     </ReactCSSTransitionGroup>
//                 </div>
//             )
//         }
//     });
