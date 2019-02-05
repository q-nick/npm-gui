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
  @observable dependencies: { [key: string]: Dependency.Entire[] } = {};
  @observable dependenciesLoading: { [key: string]: {} } = {};

  @action
  setDependencies(projectPath: string, dependencies: Dependency.Entire[]): void {
    this.dependencies[projectPath] = dependencies;
  }

  @action
  async fetchDependencies(projectPath?: string): Promise<void> {
    const responseSimple = await axios
      .get(`${getBasePathFor(projectPath)}/simple`);

    this.setDependencies(projectPath, responseSimple.data);

    const responseFull = await axios
      .get(`${getBasePathFor(projectPath)}`);

    this.setDependencies(projectPath, responseFull.data);
  }

  @action
  async installDependency(
    projectPath: string,
    repo: Dependency.Repo,
    dependency: Dependency.Basic,
    type: Dependency.Type,
  ): Promise<void> {
    // TODO loading
    await axios.post(
      `${getBasePathFor(projectPath)}/${type}/${repo}`,
      [{ name: dependency.name, version: dependency.version }],
    );

    this.fetchDependencies(projectPath);
  }

  @action
  async deleteDependency(
    projectPath: string,
    repo: Dependency.Repo,
    dependencyName: string,
    type: Dependency.Type,
  ): Promise<void> {
    // TODO loading
    await axios.delete(`${getBasePathFor(projectPath)}/${type}/${repo}/${dependencyName}`);

    this.fetchDependencies(projectPath);
  }

  @action
  async installAll(projectPath: string): Promise<void> {
    // dependencies.forEach(dependency => commit('setDependencyExecutingStart', dependency.name));

    await axios.post(`${getBasePathFor(projectPath)}/install`, {});

    // dependencies.forEach(dependency => commit('setDependencyExecutingStop', dependency.name));
    // dispatch('load', { project });
    this.fetchDependencies(projectPath);
  }

  @action
  async forceReinstallAll(projectPath: string): Promise<void> {
    // dependencies.forEach(dependency => commit('setDependencyExecutingStart', dependency.name));

    await axios.post(`${getBasePathFor(projectPath)}/install/force`, {});

    // dependencies.forEach(dependency => commit('setDependencyExecutingStop', dependency.name));
    // dispatch('load', { project });
    this.fetchDependencies(projectPath);
  }
}

export const dependenciesStore = new DependenciesStore();
