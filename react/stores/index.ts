import { consoleStore } from './console.store';
import { searchStore } from './search.store';
import { projectDependenciesStore, globalDependenciesStore } from './dependencies.store';

export const stores = {
  projectDependenciesStore,
  globalDependenciesStore,
  consoleStore,
  searchStore,
};
