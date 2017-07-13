import React from 'react';
import ReactDOM from 'react-dom';
import uuid from 'uuid';
require('../style/main.scss');
var cancelCell = new createCancelCell(5,5,[1,2,3,4,5]);
let cellHub = {};
//debugger;
cancelCell.init();
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
var CancelUnit = React.createClass({
	markMouseDown: function(e){
		onMouseDownX = e.screenX;
		onMouseDownY = e.screenY;
		//console.log('mousedownX',onMouseDownX );
	},
	markMouseUp: function(e){
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
		var direction = judgeDirection(down,up);
		this.props.exchange(direction);
	},
	render: function(){
		var containerWidth = 450;
		var containerHeight = 600;

		var left = this.props.colIndex * containerWidth/cancelCell.cols;
		var top = this.props.rowIndex * containerHeight/cancelCell.rows;
		let colorNum = this.props.color;
		var styleObj = {
			left: left,
			top: top,
			backgroundColor: colorMap[colorNum],
			width: containerWidth/cancelCell.cols,
			height: containerHeight/cancelCell.rows,
			position: 'absolute'
		}
		if(colorNum == 0) styleObj.opacity = 0;
		return(<section className="cancel-unit" onMouseDown = {this.markMouseDown} onDragEnd = {this.markMouseUp} draggable="true" style = {styleObj} />)
	}
});

class CancelContainer extends React.Component {
	constructor(props){
		super(props);
		this.state = { cellHub };
	}
	exchange(i, j){
		return function(dir){
		cancelCell.exchange([i,j],dir);
		reLink(cellHub, cancelCell.state);
		this.setState({cellHub});
		// cancelCell.canBeCanceled = true;
		// while(cancelCell.canBeCanceled){
		// 	cancelCell.cancel();
		// 	reLink(cellHub, cancelCell.state);
		// 	this.setState({cellHub});
		// 	cancelCell.adjust();
		// 	reLink(cellHub, cancelCell.state);
		// 	this.setState({cellHub});

		// }
		function timmer(){
			let unfinished = cancelCell.cancel();
			reLink(cellHub, cancelCell.state);
			this.setState({cellHub});			
			cancelCell.adjust();
			reLink(cellHub, cancelCell.state);
			this.setState({cellHub});
			console.log('timmer');
			if(unfinished){
				setTimeout(timmer,1000);
			}
		}
		timmer = timmer.bind(this);
		timmer();
		//debugger;
	}.bind(this)
	}
	testExchange(){
		let temp1 = cancelCell.state[0][0];
		let temp2 = cancelCell.state[0][1];
		cancelCell.state[0][0] = temp2;
		cancelCell.state[0][1] = temp1;
		reLink(cellHub, cancelCell.state);
		this.setState({cellHub});
	}
	render(){
		var cancelUnitArr = [];
		// for(var i =0;i<cancelCell.state.length;i++){
		// 	for(var j = 0;j<cancelCell.state[0].length;j++){
		// 		if(this.state.state[i][j])
		// 			cancelUnitArr.push(<CancelUnit exchange = {this.exchange(i,j)} key = {this.state.state[i][j].key} color = {this.state.state[i][j].color} rowIndex = {i} colIndex = {j} />)
		// 	}
		// }
		for(let k in cellHub){
			let cellObj = cellHub[k];
			let i = cellObj.row;
			let j = cellObj.col;
			cancelUnitArr.push(<CancelUnit exchange = {this.exchange(i,j)} key = {k} color = {cellObj.color} rowIndex = {i} colIndex = {j} />)
		}
		let style = {
			position: 'absolute',
			top: 800,
		}
		return(<div className = 'container'>
			{cancelUnitArr}
			<button style={style} onClick={this.testExchange.bind(this)}>test!</button>
			</div>)
	}
}
export default class App extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (<div className = "container" >
			<CancelContainer />
			</div>
		)
	}
};
function createCancelCell(rows, cols, colors) {
	//要写这么多this？
	this.state = [],
		this.rows = rows,
		this.cols = cols,
		this.colors = colors,
		this.minCancelNum = 3,
		this.canBeCanceled = true,
		this.init = function() {
			for (let i = 0; i < this.rows; i++) {
				var rowceil = [];
				for (var j = 0; j < this.cols; j++) {
					//depend s on how many colors
					var rand = getRangeRandom(1, this.colors.length+1);
					let key = uuid.v4();
					rowceil.push({
						key: key,
						color: rand,
					});
					cellHub[key] = {
						color: rand,
						row: i,
						col: j,
					}
				}
				this.state.push(rowceil);
			}
			//this.state = [[1,1,2,2,4,4],[4,4,4,4,2,2],[4,2,3,3,3,3],[4,2,2,1,1,1]];
		},
		this.exchange = function(location, direction) {
			var state = this.state;
			var x = location[0];
			var y = location[1];
			var targetX = x;
			var targetY = y;
			switch (direction) {
				case 0:
					targetX--;
					break;
				case 1:
					targetY++;
					break;
				case 2:
					targetX++;
					break;
				case 3:
					targetY--;
					break;
				default:
					alert("error!");
			}
			//maybe it is dragged out of bound
			if (targetX >= 0 && targetX < state.length && targetY >= 0 && targetY < state[0].length) {
				//exchange two locations obj
				var dragObj = state[x][y];
				state[x][y] = state[targetX][targetY];
				state[targetX][targetY] = dragObj;
				reLink(cellHub, state);
			}
			//this.showState();
		},
		this.cancel = function() {
			var state = this.state;
			var waitForCancel = [];
			for (var c of colors) {
				//console.log(c);
				for (var i = 0; i < state.length; i++) {
					var counter = 0;
					for (var j = 0; j <= state[0].length; j++) {
						if (state[i][j] && state[i][j].color == c) {
							counter++
						} else {
							if (counter >= this.minCancelNum) {
								for (var k = 0; k < counter; k++) {
									//arr[i][j-(k+1)]=0;
									waitForCancel.push([i, j - (k + 1)]);
								}
								
							}
							counter = 0;
						}
					}
				}

			}
			//纵向
			for (var c of colors) {
				// console.log(c);
				for (var i = 0; i < state[0].length; i++) {
					var counter = 0;
					for (var j = 0; j <= state.length; j++) {
						//why judge state[j]?
						if (state[j] && state[j][i] && state[j][i].color == c) {
							counter++
						} else {
							if (counter >= this.minCancelNum) {
								for (var k = 0; k < counter; k++) {
									//arr[i][j-(k+1)]=0;
									waitForCancel.push([j - (k + 1), i]);
								}
								
							}
							counter = 0;
						}
					}
				}

			}
			//遍历记录的坐标，逐个清除
			if (waitForCancel.length == 0) {
				this.canBeCanceled = false;
				return false;
			} else {
				for (var i = 0; i < waitForCancel.length; i++) {
					var rowNum = waitForCancel[i][0];
					var colNum = waitForCancel[i][1];
					state[rowNum][colNum].color = 0;
				}
				return true;
			}
			//this.showState();
		},
		this.adjust = function() {
			var state = this.state;
			for (var j = 0; j < state[0].length; j++) {
				//复制非零元素
				var tempArr = [];
				for (var i = 0; i < state.length; i++) {
					if (state[i][j] && state[i][j].color) {
						tempArr.push(state[i][j])
					}
				}
				//非零元素向下聚拢
				for (var i = 0, k = state.length; i < k; i++) {
					if (tempArr[i]) {
						state[k - 1 - i][j] = tempArr[tempArr.length - 1 - i];
					} else {
						state[k - 1 - i][j] = null;
					}

				}
			}
			//this.showState();
		},
		this.acceptInput = function(location, direction) {
			this.exchange(location, direction);
			while (this.cancel()) {
				console.log('one time cancel!');
				this.adjust();
			}
		},
		this.interface = function(location, direction){
			this.exchange(location, direction);
		}
		this.showState = function() {
			var state = this.state;
			for (var i = 0; i < state.length; i++) {
				console.log(testArr[i])
			}
		}
}
function getRangeRandom(low, height) {
	return Math.floor(Math.random() * (height - low) + low);
}
function judgeDirection(down,up){
	var arr = [];
	arr[0] = -up.y+down.y;
	arr[1] = up.x-down.x;
	arr[2] = -down.y + up.y;
	arr[3] = down.x - up.x;
	var direction = 0;
	var value = arr[0];
	for(var i = 0;i<arr.length;i++){
		if(arr[i]>value){
			direction = i;
			value = arr[i];
		}
	}
	return direction;
}

// const app = document.createElement('div');
// document.body.appendChild(app);
// ReactDOM.render(<App />, app);
function reLink(obj, state){
	for(let i=0; i<state.length; i++){
		for(let j =0; j<state[0].length; j++){
			if(state[i][j]) {
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