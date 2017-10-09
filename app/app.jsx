import React from 'react';
import ReactDOM from 'react-dom';
import cancelCell from '../store/cancelCell.js';
require('../style/main.scss');

var colorMap = {
	1: 'green',
	2: 'yellow',
	3: 'red',
	4: 'blue',
	5: 'orange'
};
var onMouseDownX = 0;
var onMouseDownY = 0;
var onMouseUpX = 0;
var onMouseUpY = 0;
class CancelUnit extends React.Component {
	constructor(props) {
		super(props);
		this.markMouseUp = this.markMouseUp.bind(this);
	}
	markMouseDown(e) {
		onMouseDownX = e.screenX;
		onMouseDownY = e.screenY;
		//console.log('mousedownX',onMouseDownX );
	}
	markMouseUp(e) {
		//debugger;
		onMouseUpX = e.screenX;
		onMouseUpY = e.screenY;
		//console.log('mouseupX',onMouseUpX );
		var up = {
			x: onMouseUpX,
			y: onMouseUpY
		};
		var down = {
			x: onMouseDownX,
			y: onMouseDownY
		}
		//debugger;
		var direction = judgeDirection(down, up);
		this.props.exchange(direction);
	}
	render() {
		var containerWidth = 450;
		var containerHeight = 600;

		var left = this.props.colIndex * containerWidth / cancelCell.cols;
		var top = this.props.rowIndex * containerHeight / cancelCell.rows;
		let colorNum = this.props.color;
		var styleObj = {
			left: left,
			top: top,
			backgroundColor: colorMap[colorNum],
			width: containerWidth / cancelCell.cols,
			height: containerHeight / cancelCell.rows,
			position: 'absolute'
		}
		// if(colorNum == 0) styleObj.opacity = 0;
		return (<section className="cancel-unit" onMouseDown={this.markMouseDown} onDragEnd={this.markMouseUp} draggable="true" style={styleObj} />)
	}
}

class CancelContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = { cellHub: cancelCell.cellHub };
	}
	componentDidUpdate() {
		if (cancelCell.canBeCanceled === false) return;
		setTimeout(() => cancelCell.next(), 300);
	}
	componentDidMount() {
		cancelCell.cb = this.setState.bind(this);
	}
	exchange(i, j) {
		return function (dir) {
			cancelCell.exchange([i, j], dir);
		}
	}
	render() {
		var cancelUnitArr = [];
		// for(var i =0;i<cancelCell.state.length;i++){
		// 	for(var j = 0;j<cancelCell.state[0].length;j++){
		// 		if(this.state.state[i][j])
		// 			cancelUnitArr.push(<CancelUnit exchange = {this.exchange(i,j)} key = {this.state.state[i][j].key} color = {this.state.state[i][j].color} rowIndex = {i} colIndex = {j} />)
		// 	}
		// }
		for (let k in cancelCell.cellHub) {
			let cellObj = cancelCell.cellHub[k];
			let i = cellObj.row;
			let j = cellObj.col;
			cancelUnitArr.push(<CancelUnit exchange={this.exchange(i, j)} key={k} color={cellObj.color} rowIndex={i} colIndex={j} />)
		}
		let style = {
			position: 'absolute',
			top: 800,
		}
		return (<div className='container'>
			{cancelUnitArr}
		</div>)
	}
}
export default class App extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (<div className="container" >
			<CancelContainer />
		</div>
		)
	}
};

function judgeDirection(down, up) {
	var arr = [];
	arr[0] = -up.y + down.y;
	arr[1] = up.x - down.x;
	arr[2] = -down.y + up.y;
	arr[3] = down.x - up.x;
	var direction = 0;
	var value = arr[0];
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] > value) {
			direction = i;
			value = arr[i];
		}
	}
	return direction;
}

// const app = document.createElement('div');
// document.body.appendChild(app);
// ReactDOM.render(<App />, app);
function reLink(obj, state) {
	for (let i = 0; i < state.length; i++) {
		for (let j = 0; j < state[0].length; j++) {
			if (state[i][j]) {
				let k = state[i][j].key;
				obj[k] = {
					row: i,
					col: j,
					color: state[i][j].color,
				};
			}
		}
	}
}