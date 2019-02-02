import { observable } from 'mobx';

export class GlobalDependenciesStore {
  @observable sortMatch: string;
  @observable sortKey: string;
  @observable sortReversed: boolean;
  @observable dependencies: Dependency.Entire[];
  @observable dependenciesLoading: any = {};
}

export const globalDependenciesStore = new GlobalDependenciesStore();

globalDependenciesStore.dependencies = [{
  name: 'react',
  type: 'global',
  repo: 'npm',
}];
