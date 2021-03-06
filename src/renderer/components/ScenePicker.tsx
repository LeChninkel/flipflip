import {remote} from 'electron';
import * as React from 'react';
import Sortable from "sortablejs";

import {SF} from "../const";
import {arrayMove, getRandomListItem} from "../utils";
import Scene from '../Scene';
import SimpleOptionPicker from "./ui/SimpleOptionPicker";

class ScenePickerItem extends React.Component {
  readonly props: { scene: Scene, onSelect(scene: Scene): void };

  render() {
    return (
      <div
        className={`ScenePickerItem u-clickable u-draggable ${this.props.scene.tagWeights ? 'm-generator' : ''}`}
        onClick={this.onClick.bind(this)}>
        <div className="ScenePickerItem__Title">
          {this.props.scene.name}
        </div>
      </div>
    );
  }

  onClick() {
    this.props.onSelect(this.props.scene);
  }
}

class Link extends React.Component {
  readonly props: {
    url: string,
    onClick?(): void,
    children?: React.ReactNode,
  };

  render() {
    return <a href={this.props.url} onClick={this.onClick.bind(this)}>{this.props.children}</a>
  }

  onClick(e: Event) {
    e.preventDefault();
    if (this.props.onClick) {
      this.props.onClick();
    } else {
      remote.shell.openExternal(this.props.url);
    }
  }
}

export default class ScenePicker extends React.Component {
  readonly props: {
    scenes: Array<Scene>,
    version: string,
    canGenerate: boolean,
    onAdd(): void,
    onImport(): void,
    onSelect(scene: Scene): void,
    onOpenLibrary(): void,
    onGenerate(): void,
    onConfig(): void,
    onUpdateScenes(scenes: Array<Scene>): void,
  };

  render() {
    return (
      <div className="ScenePicker">
        <div className="About">
          <div className="Header">
            <div className="u-float-right">
              <SimpleOptionPicker
                label=""
                value="Sort"
                disableFirst={true}
                keys={["Sort"].concat(Object.values(SF))}
                onChange={this.onSort.bind(this)}
              />
              {this.props.scenes.length > 1 && (
                <div className="u-random" onClick={this.onRandom.bind(this)}/>
              )}
              <div className="u-import" onClick={this.props.onImport.bind(this)}/>
              <div className="u-config" onClick={this.props.onConfig.bind(this)}/>
            </div>
            <h1>FlipFlip</h1>
            <small>v{this.props.version}</small>
          </div>

          <div><Link url="https://github.com/ififfy/flipflip/wiki/FlipFlip-User-Manual">User manual</Link></div>

          <div>
            <Link url="https://github.com/ififfy/flipflip/issues">Report a problem or suggest an improvement</Link>
          </div>

          <div>
            If you like FlipFlip, drop me a line at <a href="mailto:ififfy@mm.st">ififfy@mm.st</a> and tell me
            about how you're using it. :-)
          </div>
        </div>

        <div className="ScenePicker__Buttons">
          <div className="ScenePicker__LibraryButton u-clickable" onClick={this.props.onOpenLibrary}>
            Library
          </div>
          <div className={`ScenePicker__GenerateSceneButton ${this.props.canGenerate ? 'u-clickable' : 'u-disabled'}`}
               onClick={this.props.canGenerate ? this.props.onGenerate.bind(this) : this.nop}>
            + Add Scene Generator
          </div>
          <div className="ScenePicker__AddSceneButton u-clickable" onClick={this.props.onAdd.bind(this)}>
            + Add Scene
          </div>
        </div>

        <hr/>

        <div className="ScenePicker__Scenes" id="scenes">
          {this.props.scenes.map((scene) =>
            <ScenePickerItem key={`${scene.id}`} scene={scene} onSelect={this.props.onSelect}/>
          )}
        </div>
      </div>
    );
  }

  nop() {}

  onEnd(evt: any) {
    let newScenes = this.props.scenes;
    arrayMove(newScenes, evt.oldIndex, evt.newIndex);
    this.props.onUpdateScenes(newScenes);
  }

  componentDidMount() {
    if (this.props.scenes.length == 0) return;
    Sortable.create(document.getElementById('scenes'), {
      animation: 150,
      easing: "cubic-bezier(1, 0, 0, 1)",
      draggable: ".u-draggable",
      onEnd: this.onEnd.bind(this),
    });
  }

  onRandom() {
    this.props.onSelect(getRandomListItem(this.props.scenes));
  }

  onSort(algorithm: string) {
    switch (algorithm) {
      case SF.alphaA:
        this.props.onUpdateScenes(this.props.scenes.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          } else if (a.name > b.name) {
            return 1;
          } else {
            return 0;
          }
        }));
        break;
      case SF.alphaD:
        this.props.onUpdateScenes(this.props.scenes.sort((a, b) => {
          if (a.name > b.name) {
            return -1;
          } else if (a.name < b.name) {
            return 1;
          } else {
            return 0;
          }
        }));
        break;
      case SF.dateA:
        this.props.onUpdateScenes(this.props.scenes.sort((a, b) => {
          if (a.id < b.id) {
            return -1;
          } else if (a.id > b.id) {
            return 1;
          } else {
            return 0;
          }
        }));
        break;
      case SF.dateD:
        this.props.onUpdateScenes(this.props.scenes.sort((a, b) => {
          if (a.id > b.id) {
            return -1;
          } else if (a.id < b.id) {
            return 1;
          } else {
            return 0;
          }
        }));
        break;
      case SF.type:
        this.props.onUpdateScenes(this.props.scenes.sort((a, b) => {
          if (!a.tagWeights && b.tagWeights) {
            return -1;
          } else if (a.tagWeights && !b.tagWeights) {
            return 1;
          } else {
            if (a.name < b.name) {
              return -1;
            } else if (a.name > b.name) {
              return 1;
            } else {
              return 0;
            }
          }
        }));
        break;
    }
  }
};