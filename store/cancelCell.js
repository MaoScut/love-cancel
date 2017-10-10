import uuid from 'uuid';

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

function CreateCancelCell(rows, cols, colors) {
  // 创建一个二维矩阵，每个位置的数字表示颜色
  const matrix = createDifferentColorMatrix(rows, cols, colors);
  const cellHub = {};
  let status = 0;
  let canBeCanceled = false;
  let cb = null;
  // 将二维矩阵的元素变成obj，包含key，row，col，color
  // 同时扩充行数，方便后续的填充
  for (let i = -rows; i < rows; i += 1) {
    if (i < 0) matrix[i] = [];
    else {
      for (let j = 0; j < cols; j += 1) {
        const color = matrix[i][j];
        const key = uuid.v4();
        matrix[i][j] = {
          key,
          color,
        };
        cellHub[key] = {
          color,
          row: i,
          col: j,
        };
      }
    }
  }
  function matrixElementSwap(location1, location2) {
    const i1 = location1[0];
    const j1 = location1[1];
    const i2 = location2[0];
    const j2 = location2[1];
    const e1 = matrix[i1][j1];
    const e2 = matrix[i2][j2];
    const k1 = e1.key;
    const k2 = e2.key;
    // matrix swap
    [matrix[i1][j1], matrix[i2][j2]] = [matrix[i2][j2], matrix[i1][j1]];
    // modify cellHub
    cellHub[k1].row = i2;
    cellHub[k1].col = j2;
    cellHub[k2].row = i1;
    cellHub[k2].col = j1;
  }
  function matrixElementCancel(i, j) {
    const obj = matrix[i][j];
    obj.color = 0;
    cellHub[obj.key].color = 0;
  }
  function exchange(location, direction) {
    canBeCanceled = true;
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
  }
  function cancel() {
    const waitForCancel = [];
    colors.forEach((c) => {
      for (let i = 0; i < matrix.length; i += 1) {
        let counter = 0;
        for (let j = 0; j <= matrix[0].length; j += 1) {
          if (matrix[i][j] && matrix[i][j].color === c) {
            counter += 1;
          } else {
            if (counter >= this.minCancelNum) {
              for (let k = 0; k < counter; k += 1) {
                // arr[i][j-(k+1)]=0;
                waitForCancel.push([i, j - (k + 1)]);
              }
            }
            counter = 0;
          }
        }
      }
      for (let i = 0; i < matrix[0].length; i += 1) {
        let counter = 0;
        for (let j = 0; j <= matrix.length; j += 1) {
          // why judge matrix[j]?
          if (matrix[j] && matrix[j][i] && matrix[j][i].color === c) {
            counter += 1;
          } else {
            if (counter >= this.minCancelNum) {
              for (let k = 0; k < counter; k += 1) {
                // arr[i][j-(k+1)]=0;
                waitForCancel.push([j - (k + 1), i]);
              }
            }
            counter = 0;
          }
        }
      }
    });

    // 遍历记录的坐标，逐个清除
    if (waitForCancel.length === 0) {
      status = 0;
      this.canBeCanceled = false;
    } else {
      status = 2;
      for (let i = 0; i < waitForCancel.length; i += 1) {
        const row = waitForCancel[i][0];
        const col = waitForCancel[i][1];
        // matrix[rowNum][colNum].color = 0;
        matrixElementCancel(row, col, matrix);
      }
    }
  }
  function fill() {
    status = 3;
    for (let j = 0; j < matrix[0].length; j += 1) {
      // 复制非零元素
      const tempArr = [];
      for (let i = 0; i < matrix.length; i += 1) {
        if (matrix[i][j] && matrix[i][j].color) {
          tempArr.push(matrix[i][j]);
        }
      }
      const fillNum = this.rows - tempArr.length;
      for (let m = 0; m < fillNum; m += 1) {
        const key = uuid.v4();
        const color = getRangeRandom(1, 6);
        // matrix[-(m + 1)] = [];
        matrix[-(m + 1)][j] = {
          key,
          color,
        };
        this.cellHub[key] = {
          color,
          row: -(m + 1),
          col: j,
        };
      }
    }
  }
  function adjust() {
    this.status = 1;
    for (let j = 0; j < matrix[0].length; j += 1) {
      let postion = matrix.length - 1;
      for (let i = matrix.length - 1; i >= -matrix.length; i -= 1) {
        if (matrix[i][j].color === 0) {
          continue;
        } else {
          matrix[postion][j] = matrix[i][j];
          const key = matrix[postion][j].key;
          this.cellHub[key].row = postion;
          postion -= 1;
          if (postion === -1) break;
        }
      }
    }
  }
  function next() {
    if (status === 1) {
      cancel();
      cb({
        cellHub,
      });
      return;
    }
    if (status === 2) {
      fill();
      cb({
        cellHub,
      });
      return;
    }
    if (status === 3) {
      adjust();
      cb({
        cellHub,
      });
    }
  }
  function subscribe(callback) {
    cb = callback;
  }
  function getStatus() {
    return status;
  }
  function getCanBeCanceled() {
    return canBeCanceled;
  }
  return {
    exchange,
    cancel,
    next,
    subscribe,
    cellHub,
  };
}

export default CreateCancelCell(5, 5, [1, 2, 3, 4, 5]);
