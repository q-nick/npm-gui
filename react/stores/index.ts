import { consoleStore } from './console.store';
import { searchStore } from './search.store';
import { projectDependenciesStore } from './projectDependencies.store';
import { globalDependenciesStore } from './globalDependencies.store';

export const stores = {
  projectDependenciesStore,
  globalDependenciesStore,
  consoleStore,
  searchStore,
};
