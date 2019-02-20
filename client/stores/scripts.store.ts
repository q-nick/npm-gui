import { observable, action } from 'mobx';
import axios from 'axios';

export class ScriptsStore {
  @observable scripts: { [key: string]: NpmGui.Script[] } = {};
  @observable scriptsProcessing: { [key: string]: { [key: string]: boolean } } = {};

  @action
  setScripts(projectPath: string, scripts: NpmGui.Script[]): void {
    this.scripts[projectPath] = scripts;
    if (!this.scriptsProcessing[projectPath]) {
      this.scriptsProcessing[projectPath] = {};
    }
  }

  @action
  setScriptProcessing(projectPath: string, scriptName: string, status: boolean): void {
    if (this.scriptsProcessing[projectPath]) {
      this.scriptsProcessing[projectPath][scriptName] = status;
    }
  }

  @action
  async fetchScripts(projectPath?: string): Promise<void> {
    const response = await axios
      .get(`/api/project/${projectPath}/scripts`);

    this.setScripts(projectPath, response.data);
  }

  @action
  async runScript(projectPath: string, scriptName: string): Promise<void> {
    this.setScriptProcessing(projectPath, scriptName, true);

    await axios.get(`/api/project/${projectPath}/scripts/${scriptName}/run`);

    this.setScriptProcessing(projectPath, scriptName, false);
  }

  @action
  async deleteScript(
    projectPath: string,
    scriptName: string,
  ): Promise<void> {
    this.setScriptProcessing(projectPath, scriptName, true);

    await axios.delete(`/api/project/${projectPath}/scripts/${scriptName}`);

    this.fetchScripts(projectPath);
  }
}

export const scriptsStore = new ScriptsStore();
