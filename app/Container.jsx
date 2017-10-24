import React from 'react';
import cancelCell from '../store/cancelCell';
import Score from './Score';
import Option from './Option';
import Cancel from './Cancel';

require('../style/main.scss');

export default class CancelContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cellHub: cancelCell.cellHub,
      clearNum: 0,
      optionTimes: 0,
    };
  }
  componentDidMount() {
    cancelCell.subscribe(this.setState.bind(this));
    setTimeout(() => cancelCell.gather(), 0);
    // cancelCell.disperse();
  }
  componentDidUpdate() {
    if (cancelCell.getCanBeCanceled() === false) return;
    setTimeout(() => cancelCell.next(), 300);
  }
  render() {
    const width = 40;
    const height = 40;
    return (
      <div className="container">
        <Cancel
          cellHub={this.state.cellHub}
          rectWidth={width}
          rectHeight={height}
          exchange={cancelCell.exchange}
        />
        <Score optionTimes={this.state.optionTimes} clearNum={this.state.clearNum} />
        <Option />
      </div>
    );
  }
}
