import * as React from 'react';

import {RemoteSettings} from "../../Config";
import ControlGroup from "../sceneDetail/ControlGroup";
import SimpleTextInput from "../ui/SimpleTextInput";

export default class APIGroup extends React.Component {
  readonly props: {
    settings: RemoteSettings
    activateReddit(): void,
    onUpdateSettings(keys: RemoteSettings, fn: (keys: RemoteSettings) => void): void,
  };

  render() {
    return (
      <ControlGroup title="API Keys" isNarrow={true}>
        <div className="ControlSubgroup">
          <SimpleTextInput
            isEnabled={true}
            label="Default Tumblr API Key"
            value={this.props.settings.tumblrDefault}
            onChange={this.changeKey.bind(this, 'tumblrDefault').bind(this)}>
            {" "}
            <button onClick={this.paste.bind(this, this.changeKey.bind(this, 'tumblrDefault').bind(this))}>Paste</button>
          </SimpleTextInput>
          <SimpleTextInput
            isEnabled={true}
            label="Overlay Tumblr API Key"
            value={this.props.settings.tumblrOverlay}
            onChange={this.changeKey.bind(this, 'tumblrOverlay').bind(this)}>
            {" "}
            <button onClick={this.paste.bind(this, this.changeKey.bind(this, 'tumblrOverlay').bind(this))}>Paste</button>
          </SimpleTextInput>
        </div>
        <hr/>
        <div className="ControlSubgroup">
          <button onClick={this.props.settings.redditRefreshToken == "" ? this.props.activateReddit.bind(this) : this.nop}
                  className={`u-button ${this.props.settings.redditRefreshToken == "" ? 'u-clickable' : 'u-disabled'}`}>Authorize FlipFlip on Reddit</button>
        </div>
      </ControlGroup>
    )
  }

  nop() {}

  paste(fn: Function) {
    (navigator as any).clipboard.readText().then((pastedText: string) => {
      fn(pastedText);
    });
  }

  update(fn: (keys: any) => void) {
    this.props.onUpdateSettings(this.props.settings, fn);
  }

  changeKey(key: string, value: any) {
    this.update((s) => s[key] = value);
  }
}