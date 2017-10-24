import React from 'react';
import CancelUnit from './CancelUnit';

// export default class Cancel extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       cellHub: this.props.cancelCell.cellHub,
//     };
//   }
//   render() {
//     const cancelUnitArr = [];
//     const containerWidth = 450;
//     const containerHeight = 600;
//     const rows = this.cancelCell.getRows();
//     const cols = this.cancelCell.getCols();
//     Object.keys(this.state.cellHub).forEach((k) => {
//       const cellObj = this.cancelCell.cellHub[k];
//       const i = cellObj.row;
//       const j = cellObj.col;
//       const top = (containerHeight * i) / rows;
//       const left = (containerWidth * j) / cols;
//       const width = containerWidth / cols;
//       const height = containerHeight / rows;
//       cancelUnitArr.push(<CancelUnit
//         exchange={this.cancelCell.exchange}
//         key={k}
//         color={cellObj.color}
//         marked={cellObj.marked}
//         rowIndex={i}
//         colIndex={j}
//         top={top}
//         left={left}
//         width={width}
//         height={height}
//         rows={this.cancelCell.getRows()}
//         cols={this.cancelCell.getCols()}
//       />);
//     });
//     return (
//       <div className="container">
//         {cancelUnitArr}
//       </div>
//     )
//   }
// }
export default function Cancel({ cellHub, rectWidth, rectHeight, exchange }) {
  const cancelUnitArr = [];
  Object.keys(cellHub).forEach((k) => {
    const cellObj = cellHub[k];
    const i = cellObj.row;
    const j = cellObj.col;
    cancelUnitArr.push(<CancelUnit
      exchange={exchange}
      key={k}
      rowIndex={i}
      colIndex={j}
      marked={cellObj.marked}
      top={rectHeight * i}
      left={rectWidth * j}
      width={rectWidth}
      height={rectHeight}
      color={cellObj.color}
    />);
  });
  return (
    <div className="game">
      {cancelUnitArr}
    </div>
  );
}
