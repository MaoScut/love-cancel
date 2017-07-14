import uuid from 'uuid';

function CancelCell(rows, cols, colors) {
	this.matrix = [];
	this.cellHub = {};
	this.rows = rows;
	this.cols = cols;
	this.colors = colors;
	this.minCancelNum = 3;
	this.canBeCanceled = true;
	let matrix = this.matrix;
	let cellHub = this.cellHub;
	this.init = function() {
		for (let i = 0; i < this.rows; i++) {
			var rowceil = [];
			for (var j = 0; j < this.cols; j++) {
				//depend s on how many colors
				var rand = getRangeRandom(1, this.colors.length + 1);
				let key = uuid.v4();
				rowceil.push({
					key: key,
					color: rand,
				});
				this.cellHub[key] = {
					color: rand,
					row: i,
					col: j,
				}
			}
			this.matrix.push(rowceil);
		}
		//this.matrix = [[1,1,2,2,4,4],[4,4,4,4,2,2],[4,2,3,3,3,3],[4,2,2,1,1,1]];
	};
	this.exchange = function(location, direction) {
		var matrix = this.matrix;
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
		if (targetX >= 0 && targetX < matrix.length && targetY >= 0 && targetY < matrix[0].length) {
			//exchange two locations obj
			// var dragObj = matrix[x][y];
			// matrix[x][y] = matrix[targetX][targetY];
			// matrix[targetX][targetY] = dragObj;
			// reLink(cellHub, matrix);
			matrixElementSwap([x, y], [targetX, targetY]);
		}
		//this.showmatrix();
	};
	this.cancel = function() {
		var matrix = this.matrix;
		var waitForCancel = [];
		for (var c of colors) {
			//console.log(c);
			for (var i = 0; i < matrix.length; i++) {
				var counter = 0;
				for (var j = 0; j <= matrix[0].length; j++) {
					if (matrix[i][j] && matrix[i][j].color == c) {
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
			for (var i = 0; i < matrix[0].length; i++) {
				var counter = 0;
				for (var j = 0; j <= matrix.length; j++) {
					//why judge matrix[j]?
					if (matrix[j] && matrix[j][i] && matrix[j][i].color == c) {
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
				var row = waitForCancel[i][0];
				var col = waitForCancel[i][1];
				// matrix[rowNum][colNum].color = 0;
				matrixElementCancel(row, col);
			}
			return true;
		}
		//this.showmatrix();
	};
	this.adjust = function() {
		var matrix = this.matrix;
		for (var j = 0; j < matrix[0].length; j++) {
			//复制非零元素
			var tempArr = [];
			for (var i = 0; i < matrix.length; i++) {
				if (matrix[i][j] && matrix[i][j].color) {
					tempArr.push(matrix[i][j])
				}
			}
			//非零元素向下聚拢
			for (var i = 0, k = matrix.length; i < k; i++) {
				if (tempArr[i]) {
					let obj = tempArr[tempArr.length - 1 - i];
					matrix[k - 1 - i][j] = obj;
					this.cellHub[obj.key].row = k-1-i;
					this.cellHub[obj.key].col = j;
				} else {
					matrix[k - 1 - i][j] = null;
				}
			}
		}
		//this.showmatrix();
	};
	this.acceptInput = function(location, direction) {
		this.exchange(location, direction);
		while (this.cancel()) {
			console.log('one time cancel!');
			this.adjust();
		}
	};
	this.interface = function(location, direction) {
		this.exchange(location, direction);
	};
	this.showMatrix = function() {
		var matrix = this.matrix;
		for (var i = 0; i < matrix.length; i++) {
			console.log(testArr[i])
		}
	};
	function matrixElementSwap(location1, location2){
		let i1 = location1[0], j1 = location1[1], i2 = location2[0], j2 = location2[1];
		let e1 = matrix[i1][j1];
		let e2 = matrix[i2][j2];
		let k1 = e1.key;
		let k2 = e2.key;
		//matrix swap
		[matrix[i1][j1], matrix[i2][j2]] = [matrix[i2][j2], matrix[i1][j1]];
		//modify cellHub
		cellHub[k1].row = i2;
		cellHub[k2].col = j2;
		cellHub[k2].row = i1;
		cellHub[k2].col = j1;		
	}
	function matrixElementCancel(i, j) {
		let obj = matrix[i][j];
		obj.color = 0;
		delete cellHub[obj.key];
	}
}
let cancelCell = new CancelCell(5,5,[1,2,3,4,5]);
cancelCell.init();
export default cancelCell;
function getRangeRandom(low, height) {
	return Math.floor(Math.random() * (height - low) + low);
}