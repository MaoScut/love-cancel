import React from 'react';
import cancelCell from '../store/cancelCell';
import CancelUnit from './CancelUnit';

require('../style/main.scss');

export default class CancelContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { cellHub: cancelCell.cellHub };
  }
  componentDidMount() {
    cancelCell.subscribe(this.setState.bind(this));
  }
  componentDidUpdate() {
    if (cancelCell.getCanBeCanceled() === false) return;
    setTimeout(() => cancelCell.next(), 300);
  }
  render() {
    const cancelUnitArr = [];
    const containerWidth = 450;
    const containerHeight = 600;
    const rows = cancelCell.getRows();
    const cols = cancelCell.getCols();
    Object.keys(this.state.cellHub).forEach((k) => {
      const cellObj = cancelCell.cellHub[k];
      const i = cellObj.row;
      const j = cellObj.col;
      const top = (containerHeight * i) / rows;
      const left = (containerWidth * j) / cols;
      const width = containerWidth / cols;
      const height = containerHeight / rows;
      cancelUnitArr.push(<CancelUnit
        exchange={cancelCell.exchange}
        key={k}
        color={cellObj.color}
        rowIndex={i}
        colIndex={j}
        top={top}
        left={left}
        width={width}
        height={height}
        rows={cancelCell.getRows()}
        cols={cancelCell.getCols()}
      />);
    });
    return (
      <div className="container">
        {cancelUnitArr}
      </div>
    );
  }
}
