import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { ScriptsStore } from '../stores/scripts.store';
import { ScriptsTable } from '../components/Scripts/ScriptsTable';
import { toJS } from 'mobx';

interface Props {
  scriptsStore?: ScriptsStore;
  projectPath: string;
}

@inject('scriptsStore') @observer
export class ScriptsContainer extends React.Component<Props> {
  componentDidMount(): void {
    this.props.scriptsStore.fetchScripts(this.props.projectPath);
  }

  onDeleteScript = (script: any): void => {
    this.props.scriptsStore.deleteScript(
      this.props.projectPath,
      script.name,
    );
  }

  onRunScript =  (script: any): void => {
    this.props.scriptsStore.runScript(
      this.props.projectPath,
      script.name,
    );
  }

  render(): React.ReactNode {
    const scripts = toJS(this.props.scriptsStore.scripts[this.props.projectPath]);

    const scriptsProcessing =
      toJS(this.props.scriptsStore.scriptsProcessing[this.props.projectPath]);

    return (
      <ScriptsTable
        key="2"
        scripts={scripts}
        scriptsProcessing={scriptsProcessing}
        onDeleteScript={this.onDeleteScript}
        onRunScript={this.onRunScript}
      />
    );
  }
}
