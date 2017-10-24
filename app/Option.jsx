import React from 'react';

export default class Option extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      row: 10,
      col: 10,
      color: 5,
    };
    this.inputChange = this.inputChange.bind(this);
  }
  inputChange() {
    this.setState({
      row: this.rowInput.value,
      col: this.colInput.value,
      color: this.colorInput.value,
    });
  }
  render() {
    return (
      <div className="option">
        <input
          onChange={this.inputChange}
          ref={(input) => { this.rowInput = input; }}
          type="text"
        />
        <input
          onChange={this.inputChange}
          ref={(input) => { this.colInput = input; }}
          type="text"
        />
        <input
          onChange={this.inputChange}
          ref={(input) => { this.colorInput = input; }}
          type="text"
        />
        <button onClick={() => this.props.onSubmit(this.state)}>开始</button>
      </div>
    );
  }
}
