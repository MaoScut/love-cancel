import uuid from 'uuid';

function getRangeRandom(low, height) {
  return Math.floor((Math.random() * (height - low)) + low);
}

// function createNewElement() {
//   let rand = getRangeRandom(1, 6);
//   return {
//     key: uuid.v4(),
//     color: rand,
//   }
// }
function createRandomColorMatrix(rows, cols, colors) {
  const matrix = new Array(rows);
  for (let i = 0; i < rows; i += 1) {
    const rowCell = new Array(cols);
    for (let j = 0; j < cols; j += 1) {
      rowCell[j] = getRangeRandom(colors[0], colors.length + 1);
    }
    matrix[i] = rowCell;
  }
  return matrix;
}
function createDifferentColorMatrix(rows, cols, colors) {
  const matrix = createRandomColorMatrix(rows, cols, colors);
  // console.log('before');
  // matrix.forEach(v => console.log(v));
  let conflictNum = Infinity;
  // let wTime = 0;
  function modifyColor(i, j) {
    let num = 0;
    const candidate = [[i - 1, j], [i, j + 1], [i + 1, j], [i, j - 1]];
    const colorAround = [];
    for (let k = 0; k < candidate.length; k += 1) {
      const [rowIndex, colIndex] = candidate[k];
      if (rowIndex === -1 || colIndex === -1 || rowIndex === rows || colIndex === cols) {
        num += 0;
      } else {
        colorAround.push(matrix[rowIndex][colIndex]);
        if (matrix[i][j] === matrix[rowIndex][colIndex]) {
          num += 1;
        }
      }
    }
    if (num === 0) return 0;
    let c = Infinity;
    let colorIndex;
    for (let k = 0; k < colors.length; k += 1) {
      let cc = 0;
      for (let m = 0; m < colorAround.length; m += 1) {
        if (colorAround[m] === colors[k]) cc += 1;
      }
      if (cc < c) {
        c = cc;
        colorIndex = colors[k];
      }
    }
    // modify the color at row i col j
    matrix[i][j] = colorIndex;
    return c;
  }
  while (conflictNum > 0) {
    conflictNum = 0;
    // wTime += 1;
    for (let i = 0; i < rows; i += 1) {
      for (let j = 0; j < cols; j += 1) {
        conflictNum += modifyColor(i, j);
      }
    }
  }
  // console.log('after');
  // matrix.forEach(v => console.log(v));
  // console.log('while execute times: ' + wTime);
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


function CreateCancelCell(rows, cols, colors) {
  // 创建一个二维矩阵，每个位置的数字表示颜色
  const matrix = createDifferentColorMatrix(rows, cols, colors);
  const cellHub = {};
  let status = 0;
  let canBeCanceled = false;
  let cb = null;
  const minCancelNum = 3;
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
    const x = location[0];
    const y = location[1];
    let targetX = x;
    let targetY = y;
    switch (direction) {
      case 0:
        targetX -= 1;
        break;
      case 1:
        targetY += 1;
        break;
      case 2:
        targetX += 1;
        break;
      case 3:
        targetY -= 1;
        break;
      default:
        // alert("error!");
    }
    // maybe it is dragged out of bound
    if (targetX >= 0 && targetX < matrix.length && targetY >= 0 && targetY < matrix[0].length) {
      status = 1;
      matrixElementSwap([x, y], [targetX, targetY], matrix);
      cb({
        cellHub,
      });
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
            if (counter >= minCancelNum) {
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
            if (counter >= minCancelNum) {
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
      canBeCanceled = false;
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
      const fillNum = rows - tempArr.length;
      for (let m = 0; m < fillNum; m += 1) {
        const key = uuid.v4();
        const color = getRangeRandom(1, 6);
        // matrix[-(m + 1)] = [];
        matrix[-(m + 1)][j] = {
          key,
          color,
        };
        cellHub[key] = {
          color,
          row: -(m + 1),
          col: j,
        };
      }
    }
  }
  function adjust() {
    status = 1;
    for (let j = 0; j < matrix[0].length; j += 1) {
      let position = matrix.length - 1;
      for (let i = matrix.length - 1; i >= -matrix.length; i -= 1) {
        if (matrix[i][j].color !== 0) {
          matrix[position][j] = matrix[i][j];
          const { key } = matrix[position][j];
          cellHub[key].row = position;
          position -= 1;
          if (position === -1) break;
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
  // function getStatus() {
  //   return status;
  // }
  function getRows() {
    return rows;
  }
  function getCols() {
    return cols;
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
    getCols,
    getRows,
    getCanBeCanceled,
  };
}

export default CreateCancelCell(5, 5, [1, 2, 3, 4, 5]);
