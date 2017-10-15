import uuid from 'uuid';

/**
 * 返回区间内的随机整数，左闭右开
 * @param {Number} low 区间左端点
 * @param {Number} height 区间右端点
 */
function getRangeRandom(low, height) {
  return Math.floor((Math.random() * (height - low)) + low);
}
/**
 * 根据指定条件，返回一个不重复的数组，元素是浅复制
 * @param {Array} arr 长度必须大于等于1
 * @param {function} compare 接收两个元素，若认为相等，则返回true，否则返回false
 */
function uniqueArr(arr, compare) {
  const res = [arr[0]];
  for (let i = 1; i < arr.length; i += 1) {
    if (!res.some(v => compare(v, arr[i]))) res.push(arr[i]);
  }
  return res;
}
/**
 * 生成一个随机矩阵，元素的范围是range[0]到range[1]，左闭右开
 * @param {Number} rows 矩阵的行数
 * @param {Number} cols 矩阵的列数
 * @param {Array} range 区间
 */
function createRandomColorMatrix(rows, cols, range) {
  const matrix = new Array(rows);
  for (let i = 0; i < rows; i += 1) {
    const rowCell = new Array(cols);
    for (let j = 0; j < cols; j += 1) {
      rowCell[j] = getRangeRandom(range[0], range[1]);
    }
    matrix[i] = rowCell;
  }
  return matrix;
}
/**
 * 生成一个不冲突的随机矩阵
 * @param {Number} rows 行数
 * @param {Number} cols 列数
 * @param {Array} range 区间，左闭右开
 */
function createDifferentColorMatrix(rows, cols, range) {
  const matrix = createRandomColorMatrix(rows, cols, range);
  let conflictNum = Infinity;
  function modifyColor(i, j) {
    let num = 0;
    const candidate = [[i - 1, j], [i, j + 1], [i + 1, j], [i, j - 1]];
    const colorAround = [];
    for (let k = 0; k < candidate.length; k += 1) {
      const [rowIndex, colIndex] = candidate[k];
      // 周围的元素是边界之外的的时候跳过
      if (rowIndex === -1 || colIndex === -1 || rowIndex === rows || colIndex === cols) {
        num += 0;
      } else {
        // 收集周围4个颜色
        colorAround.push(matrix[rowIndex][colIndex]);
        // 如果自己和周围元素的颜色相同，冲突数量+1
        if (matrix[i][j] === matrix[rowIndex][colIndex]) {
          num += 1;
        }
      }
    }
    // 与周围元素颜色不同的时候，该位置冲突数量为0
    if (num === 0) return 0;
    // 该位置存在冲突，那么找出在周围四个位置中，出现次数最少的颜色
    let c = Infinity;
    let colorSeq;
    // k表示颜色标号，因为range是左闭右开，所以这里是小于而不是小于等于
    for (let k = 1; k < range[1]; k += 1) {
      let cc = 0;
      for (let m = 0; m < colorAround.length; m += 1) {
        if (colorAround[m] === k) cc += 1;
      }
      if (cc < c) {
        c = cc;
        colorSeq = k;
      }
    }
    // 把该位置设置为出现次数最少的那个颜色
    matrix[i][j] = colorSeq;
    // 返回该位置的冲突数量
    return c;
  }
  // 存在冲突时，反复修改每个位置的颜色
  while (conflictNum > 0) {
    conflictNum = 0;
    for (let i = 0; i < rows; i += 1) {
      for (let j = 0; j < cols; j += 1) {
        conflictNum += modifyColor(i, j);
      }
    }
  }
  return matrix;
}
/**
 * 创建数据中心
 * @param {Number} rows 行数
 * @param {Number} cols 列数
 * @param {Number} colorsNum 颜色数量
 */
function CreateCancelCell(rows, cols, colorsNum) {
  // 创建一个二维矩阵，每个位置的数字表示颜色
  const matrix = createDifferentColorMatrix(rows, cols, [1, colorsNum + 1]);
  // 应用的状态，与矩阵是对应的，每个元素包含key，row，col，color属性
  const cellHub = {};
  // 状态，每个阶段要做不同的事情
  // 0是初始化，1是交换元素，2是消除，3是填充，4是调整
  let status = 0;
  // 表示目前矩阵是否可以消除，根据它来判断是否调用next方法进行更新
  let canBeCanceled = false;
  // 注册回调，setState
  let cb = null;
  // 连续几个及以上能被消除
  const minCancelNum = 3;

  let optionTimes = 0;
  let clearNum = 0;

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
          row: getRangeRandom(0, 51),
          col: getRangeRandom(0, 51),
          // row: -1,
          // col: -1,
        };
      }
    }
  }
  function gather() {
    for (let i = 0; i < rows; i += 1) {
      for (let j = 0; j < cols; j += 1) {
        const key = matrix[i][j].key;
        cellHub[key].row = i;
        cellHub[key].col = j;
      }
    }
    cb({
      cellHub,
    });
  }
  /**
   * 交换两个坐标的元素，同时修改cellHub
   * @param {Array} location1 [x, y]
   * @param {Array} location2 [x, y]
   */
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
  /**
   * 把坐标对应的元素颜色设置为0
   * @param {Number} i 行坐标
   * @param {Number} j 列坐标
   */
  function matrixElementCancel(i, j) {
    const obj = matrix[i][j];
    obj.color = 0;
    cellHub[obj.key].color = 0;
  }
  /**
   * 对应坐标上的元素和某个方向上的元素交换
   * @param {Array} location 坐标，[x, y]
   * @param {Number} direction 方向，上下左右，0123
   */
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
      optionTimes += 1;
      matrixElementSwap([x, y], [targetX, targetY], matrix);
      cb({
        cellHub,
        optionTimes,
      });
    }
  }
  /**
   * 遍历矩阵，进行一次消除
   */
  function cancel() {
    const waitForCancel = [];
    for (let color = 1; color < colorsNum + 1; color += 1) {
      for (let i = 0; i < matrix.length; i += 1) {
        let counter = 0;
        for (let j = 0; j <= matrix[0].length; j += 1) {
          if (matrix[i][j] && matrix[i][j].color === color) {
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
          if (matrix[j] && matrix[j][i] && matrix[j][i].color === color) {
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
    }

    // 遍历记录的坐标，逐个清除
    if (waitForCancel.length === 0) {
      status = 0;
      canBeCanceled = false;
    } else {
      clearNum += uniqueArr(waitForCancel, (v1, v2) => v1[0] === v2[0] && v1[1] === v2[1]).length;
      console.log(clearNum);
      status = 2;
      for (let i = 0; i < waitForCancel.length; i += 1) {
        const row = waitForCancel[i][0];
        const col = waitForCancel[i][1];
        // matrix[rowNum][colNum].color = 0;
        matrixElementCancel(row, col, matrix);
      }
    }
  }
  /**
   * 计算每一列需要补充的元素数量，在每一列上方补充
   */
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
        const color = getRangeRandom(1, colorsNum + 1);
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
  /**
   * 元素向下聚拢
   */
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
  /**
   * 根据status，判断接下来该做什么
   */
  function next() {
    if (status === 1) {
      cancel();
      cb({
        cellHub,
        optionTimes,
        clearNum,
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
  /**
   * 注册矩阵改变后要触发的回调
   * @param {function} callback 矩阵改变后要触发的回调
   */
  function subscribe(callback) {
    cb = callback;
  }
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
    next,
    subscribe,
    cellHub,
    getCols,
    getRows,
    getCanBeCanceled,
    gather,
  };
}

export default CreateCancelCell(10, 10, 5);
