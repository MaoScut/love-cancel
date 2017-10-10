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
    cancelCell.cb = this.setState.bind(this);
  }
  componentDidUpdate() {
    if (cancelCell.canBeCanceled === false) return;
    setTimeout(() => cancelCell.next(), 300);
  }
  render() {
    const cancelUnitArr = [];
    this.state.cellHub.keys().forEach((k) => {
      const cellObj = cancelCell.cellHub[k];
      const i = cellObj.row;
      const j = cellObj.col;
      cancelUnitArr.push(<CancelUnit
        exchange={cancelCell.exchange}
        key={k}
        color={cellObj.color}
        rowIndex={i}
        colIndex={j}
      />);
    });
    return (
      <div className="container">
        {cancelUnitArr}
      </div>
    );
  }
}
