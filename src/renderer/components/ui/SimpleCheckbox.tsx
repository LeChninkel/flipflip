import * as React from 'react';

export default class SimpleCheckbox extends React.Component {
  readonly props: {
    text: string,
    isOn: boolean,
    onChange: (isOn: boolean) => void,
  };

  render() {
    return (
      <label className="SimpleCheckbox">
        {this.props.text}
        <input
          type="checkbox"
          value={this.props.text}
          checked={this.props.isOn}
          onChange={this.onToggle.bind(this)}/>
      </label>
    )
  }

  onToggle() {
    this.props.onChange(!this.props.isOn);
  }
}