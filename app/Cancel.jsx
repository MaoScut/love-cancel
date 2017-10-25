import React from 'react';
import CancelUnit from './CancelUnit';

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
