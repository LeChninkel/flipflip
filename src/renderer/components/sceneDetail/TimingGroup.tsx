import * as React from 'react';

import {TF} from "../../const";
import {SceneSettings} from "../../Config";
import Scene from "../../Scene";
import ControlGroup from "./ControlGroup";
import SimpleOptionPicker from "../ui/SimpleOptionPicker";
import SimpleTextInput from "../ui/SimpleTextInput";

export default class TimingGroup extends React.Component {
  readonly props: {
    scene: Scene | SceneSettings,
    onUpdateScene(scene: Scene | SceneSettings, fn: (scene: Scene | SceneSettings) => void): void,
  };

  render() {
    return (
      <ControlGroup title="Timing" isNarrow={true}>
        <SimpleOptionPicker
          onChange={this.changeKey.bind(this, 'timingFunction').bind(this)}
          label="Timing"
          value={this.props.scene.timingFunction}
          keys={Object.values(TF)}/>
        <SimpleTextInput
          isEnabled={this.props.scene.timingFunction === TF.constant}
          onChange={this.changeKey.bind(this, 'timingConstant').bind(this)}
          label="Time between images (ms)"
          value={this.props.scene.timingConstant.toString()}/>
      </ControlGroup>
    );
  }

  update(fn: (scene: any) => void) {
    this.props.onUpdateScene(this.props.scene, fn);
  }

  changeKey(key: string, value: any) {
    this.update((s) => s[key] = value);
  }
}