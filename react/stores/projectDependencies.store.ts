import { observable } from 'mobx';

export class ProjectDependenciesStore {
  @observable sortMatch: string;
  @observable sortKey: string;
  @observable sortReversed: boolean;
  @observable dependencies: Dependency.Entire[];
  @observable dependenciesLoading: any = {};
}

export const projectDependenciesStore = new ProjectDependenciesStore();

projectDependenciesStore.dependencies = [{
  name: 'angular',
  type: 'prod',
  repo: 'npm',
}];
