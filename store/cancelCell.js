import uuid from 'uuid';

/**
 * [CancelCell description]
 * @param {number} rows   rows of game matrix
 * @param {number} cols   cols of game matrix
 * @param {number} colors number of colors
 */
function CancelCell(rows, cols, colors) {
	this.matrix = [];
	this.cellHub = {};
	this.rows = rows;
	this.cols = cols;
	this.colors = colors;
	this.minCancelNum = 3;
	this.canBeCanceled = true;
	this.status = 0;
	let matrix = this.matrix;
	let cellHub = this.cellHub;
	// should show a empty first of show a colorful martix directly?
	this.init = function () {
		this.matrix = createDifferentColorMatrix(this.rows, this.cols, this.colors);
		for (let i = -this.rows; i < this.rows; i++) {
			if (i < 0) this.matrix[i] = [];
			else {
				for (let j = 0; j < this.cols; j++) {
					let colorIndex = this.matrix[i][j];
					let key = uuid.v4();
					this.matrix[i][j] = {
						key: key,
						color: colorIndex,
					};
					this.cellHub[key] = {
						color: colorIndex,
						row: i,
						col: j,
					}
				}
			}
		}
	};
	this.exchange = function (location, direction) {
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
			this.status = 1;
			matrixElementSwap([x, y], [targetX, targetY], matrix);
			this.cb({
				cellHub: this.cellHub,
			})
		}
	};
	this.cancel = function () {
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
			this.status = 0;
			this.canBeCanceled = false;
			return false;
		} else {
			this.status = 2;
			for (var i = 0; i < waitForCancel.length; i++) {
				var row = waitForCancel[i][0];
				var col = waitForCancel[i][1];
				// matrix[rowNum][colNum].color = 0;
				matrixElementCancel(row, col, this.matrix);
			}
			return true;
		}
		//this.showmatrix();
	};
	this.fill = function () {
		var matrix = this.matrix;
		this.status = 3;
		for (var j = 0; j < matrix[0].length; j++) {
			//复制非零元素
			var tempArr = [];
			for (var i = 0; i < matrix.length; i++) {
				if (matrix[i][j] && matrix[i][j].color) {
					tempArr.push(matrix[i][j])
				}
			}
			let fillNum = this.rows - tempArr.length;
			for (let m = 0; m < fillNum; m++) {
				let key = uuid.v4();
				let color = getRangeRandom(1, 6);
				//matrix[-(m + 1)] = [];
				matrix[-(m + 1)][j] = {
					key,
					color,
				};
				this.cellHub[key] = {
					color,
					row: -(m + 1),
					col: j,
				}
			}
		}
	};
	this.adjust = function () {
		this.status = 1;
		var matrix = this.matrix;
		// for (var j = 0; j < matrix[0].length; j++) {
		// 	//复制非零元素
		// 	var tempArr = [];
		// 	for (var i = 0; i < matrix.length; i++) {
		// 		if (matrix[i][j] && matrix[i][j].color) {
		// 			tempArr.push(matrix[i][j])
		// 		}
		// 	}
		// 	//非零元素向下聚拢
		// 	for (var i = 0, k = matrix.length; i < k; i++) {
		// 		if (tempArr[i]) {
		// 			let obj = tempArr[tempArr.length - 1 - i];
		// 			matrix[k - 1 - i][j] = obj;
		// 			this.cellHub[obj.key].row = k - 1 - i;
		// 			this.cellHub[obj.key].col = j;
		// 		} else {
		// 			let obj = matrix[k - 1 - i - (this.rows - tempArr.length)][j];
		// 			matrix[k - 1 - i][j] = obj;
		// 			this.cellHub[obj.key] = {
		// 				color: obj.color,
		// 				row: k - 1 - i,
		// 				col: j,
		// 			}
		// 		}
		// 	}
		// }
		//this.showmatrix();
		for (let j = 0; j < matrix[0].length; j++) {
			let postion = matrix.length - 1;
			for (let i = matrix.length - 1; i >= -matrix.length; i--) {
				if (matrix[i][j].color == 0)
					continue
				else {
					matrix[postion][j] = matrix[i][j];
					let key = matrix[postion][j].key;
					this.cellHub[key].row = postion;
					postion--;
					if (postion == -1) break;
				}
			}
		}
	};
	this.acceptInput = function (location, direction) {
		this.exchange(location, direction);
		while (this.cancel()) {
			console.log('one time cancel!');
			this.adjust();
		}
	};
	this.interface = function (location, direction) {
		this.exchange(location, direction);
	};
	this.showMatrix = function () {
		var matrix = this.matrix;
		for (var i = 0; i < matrix.length; i++) {
			console.log(testArr[i])
		}
	};
	this.start = function () {
		while (this.canBeCanceled) {
			this.cancel();
			this.cb({
				cellHub: this.cellHub,
			});
			this.fill();
			this.cb({
				cellHub: this.cellHub,
			});
			this.adjust();
			this.cb({
				cellHub: this.cellHub,
			});
		}
	}
	this.next = function () {
		if (this.status === 1) {
			this.cancel();
			this.cb({
				cellHub: this.cellHub,
			});
			return;
		}
		if (this.status === 2) {
			this.fill();
			this.cb({
				cellHub: this.cellHub,
			});
			return;
		}
		if (this.status === 3) {
			this.adjust();
			this.cb({
				cellHub: this.cellHub,
			});
			return;
		}
	}
	function matrixElementSwap(location1, location2, matrix) {
		let i1 = location1[0],
			j1 = location1[1],
			i2 = location2[0],
			j2 = location2[1];
		let e1 = matrix[i1][j1];
		let e2 = matrix[i2][j2];
		let k1 = e1.key;
		let k2 = e2.key;
		//matrix swap
		[matrix[i1][j1], matrix[i2][j2]] = [matrix[i2][j2], matrix[i1][j1]];
		//modify cellHub
		cellHub[k1].row = i2;
		cellHub[k1].col = j2;
		cellHub[k2].row = i1;
		cellHub[k2].col = j1;
	}

	function matrixElementCancel(i, j, matrix) {
		let obj = matrix[i][j];
		obj.color = 0;
		cellHub[obj.key].color = 0;
	}
}
let cancelCell = new CancelCell(5, 5, [1, 2, 3, 4, 5]);
cancelCell.init();
export default cancelCell;

function getRangeRandom(low, height) {
	return Math.floor(Math.random() * (height - low) + low);
}

function createNewElement() {
	let rand = getRangeRandom(1, 6);
	return {
		key: uuid.v4(),
		color: rand,
	}
}

function createDifferentColorMatrix(rows, cols, colors) {
	let matrix = createRandomColorMatrix(rows, cols, colors);
	// console.log('before');
	// matrix.forEach(v => console.log(v));
	let conflictNum = Infinity;
	let wTime = 0;
	function modifyColor(i, j) {
		let num = 0;
		let candidate = [[i - 1, j], [i, j + 1], [i + 1, j], [i, j - 1]];
		let colorAround = [];
		for (let k = 0; k < candidate.length; k++) {
			let [rowIndex, colIndex] = candidate[k];
			if (rowIndex == -1 || colIndex == -1 || rowIndex == rows || colIndex == cols)
				num += 0;
			else {
				colorAround.push(matrix[rowIndex][colIndex]);
				if (matrix[i][j] == matrix[rowIndex][colIndex])
					num++;
			}
		}
		if (num == 0) return 0;
		else {
			// first we find a min conflict color
			let c = Infinity;
			let colorIndex;
			for (let i = 0; i < colors.length; i++) {
				let _c = 0;
				for (let j = 0; j < colorAround.length; j++) {
					if (colorAround[j] == colors[i])
						_c++
				}
				if (_c < c) {
					c = _c;
					colorIndex = colors[i];
				}
			}
			// modify the color at row i col j
			matrix[i][j] = colorIndex;
			return c;
		}
	}
	while (conflictNum > 0) {
		conflictNum = 0;
		wTime++;
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				conflictNum += modifyColor(i, j);
			}
		}
	}
	console.log('after');
	matrix.forEach(v => console.log(v));
	console.log('while excute times: ' + wTime);
	return matrix;
}
// createDifferentColorMatrix(5, 5, 4);
/**
 * [createRandomColorMatrix description]
 * @param  {[type]} rows   [description]
 * @param  {[type]} cols   [description]
 * @param  {[type]} colors [description]
 * @return {[type]}        [description]
 */
function createRandomColorMatrix(rows, cols, colors) {
	let matrix = new Array(rows);
	for (let i = 0; i < rows; i++) {
		let rowCell = new Array(cols);
		for (let j = 0; j < cols; j++) {
			rowCell[j] = getRangeRandom(colors[0], colors.length + 1);
		}
		matrix[i] = rowCell;
	}
	return matrix;
}