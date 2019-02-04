import { observable, action } from 'mobx';
import axios from 'axios';

function getBasePathFor(projectPath: string): string {
  if (projectPath) {
    return `/api/project/${projectPath}/dependencies`;
  }

  return 'api/global';
}

export class DependenciesStore {
  @observable sortMatch: string;
  @observable sortKey: string;
  @observable sortReversed: boolean;
  @observable dependencies: Dependency.Entire[];
  @observable dependenciesLoading: any = {};

  @action
  async fetchDependencies(projectPath?: string): Promise<void> {
    const responseSimple = await axios
      .get(`${getBasePathFor(projectPath)}/simple`);

    this.setDependencies(responseSimple.data);

    const responseFull = await axios
      .get(`${getBasePathFor(projectPath)}`);

    this.setDependencies(responseFull.data);
  }

  @action
  setDependencies(dependencies: Dependency.Entire[]): void {
    this.dependencies = dependencies;
  }
}

export const projectDependenciesStore = new DependenciesStore();
export const globalDependenciesStore = new DependenciesStore();
