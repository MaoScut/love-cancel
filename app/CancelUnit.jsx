import React from 'react';

const colorMap = {
  1: '#99CC33',
  2: '#CC6699',
  3: '#FF9933',
  4: '#FFFF00',
  5: '#3366CC',
};
function judgeDirection(down, up) {
  const arr = [];
  arr[0] = -up.y + down.y;
  arr[1] = up.x - down.x;
  arr[2] = -down.y + up.y;
  arr[3] = down.x - up.x;
  let direction = 0;
  let value = arr[0];
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i] > value) {
      direction = i;
      value = arr[i];
    }
  }
  return direction;
}
export default class CancelUnit extends React.Component {
  constructor(props) {
    super(props);
    this.onMouseDownX = 0;
    this.onMouseDownY = 0;
    this.onMouseUpX = 0;
    this.onMouseUpY = 0;
    this.markMouseUp = this.markMouseUp.bind(this);
    this.markMouseDown = this.markMouseDown.bind(this);
    this.markTouchStart = this.markTouchStart.bind(this);
    this.markTouchEnd = this.markTouchEnd.bind(this);
  }
  markMouseDown(e) {
    this.onMouseDownX = e.screenX;
    this.onMouseDownY = e.screenY;
  }
  markMouseUp(e) {
    this.onMouseUpX = e.screenX;
    this.onMouseUpY = e.screenY;
    const up = {
      x: this.onMouseUpX,
      y: this.onMouseUpY,
    };
    const down = {
      x: this.onMouseDownX,
      y: this.onMouseDownY,
    };
    const direction = judgeDirection(down, up);
    this.props.exchange([this.props.rowIndex, this.props.colIndex], direction);
  }
  markTouchStart(e) {
    this.onMouseDownX = e.touches[0].screenX;
    this.onMouseDownY = e.touches[0].screenY;
  }
  markTouchEnd(e) {
    this.onMouseUpX = e.changedTouches[0].screenX;
    this.onMouseUpY = e.changedTouches[0].screenY;
    const up = {
      x: this.onMouseUpX,
      y: this.onMouseUpY,
    };
    const down = {
      x: this.onMouseDownX,
      y: this.onMouseDownY,
    };
    const direction = judgeDirection(down, up);
    this.props.exchange([this.props.rowIndex, this.props.colIndex], direction);
  }
  render() {
    const colorNum = this.props.color;
    const styleObj = {
      left: this.props.left + 57,
      top: this.props.top + 135,
      backgroundColor: colorMap[colorNum],
      width: this.props.width,
      height: this.props.height,
      position: 'absolute',
      boxSizing: 'border-box',
    };
    if (this.props.marked && colorNum !== 0) {
      styleObj.border = '3px solid red';
    }
    return (
      <section
        role="presentation"
        className="cancel-unit"
        onMouseDown={this.markMouseDown}
        onTouchStart={this.markTouchStart}
        onDragEnd={this.markMouseUp}
        onTouchEnd={this.markTouchEnd}
        draggable="true"
        style={styleObj}
      />
    );
  }
}
