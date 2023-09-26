/* eslint-disable @typescript-eslint/no-type-alias */
import { availableManagersProcedure } from '../actions/available-managers/available-managers';
import { addDependenciesProcedure } from '../actions/dependencies/add/add-project-dependencies';
import { removeDependenciesProcedure } from '../actions/dependencies/delete/remove-project-dependencies';
import { getDependenciesDetailsProcedure } from '../actions/dependencies/extras/dependency-details';
import { getDependenciesScoreProcedure } from '../actions/dependencies/extras/dependency-score';
import {
  getAllDependenciesProcedure,
  getAllDependenciesSimpleProcedure,
} from '../actions/dependencies/get/get-project-dependencies';
import { installDependenciesProcedure } from '../actions/dependencies/install/install-project-dependencies';
import { explorerProcedure } from '../actions/explorer/explorer';
import { infoProcedure } from '../actions/info/info';
import { searchProcedure } from '../actions/search/search';
import { router } from './trpc-router';

export const appRouter = router({
  getAllDependenciesSimple: getAllDependenciesSimpleProcedure,
  getAllDependencies: getAllDependenciesProcedure,
  installDependencies: installDependenciesProcedure,
  addDependencies: addDependenciesProcedure,
  removeDependencies: removeDependenciesProcedure,
  // global
  getGlobalDependenciesSimple: getAllDependenciesSimpleProcedure,
  getGlobalDependencies: getAllDependenciesProcedure,
  installGlobalDependencies: installDependenciesProcedure,
  addGlobalDependencies: addDependenciesProcedure,
  removeGlobalDependencies: removeDependenciesProcedure,
  // dependencies extras
  getDependenciesScore: getDependenciesScoreProcedure,
  getDependenciesDetails: getDependenciesDetailsProcedure,
  // other
  search: searchProcedure,
  explorer: explorerProcedure,
  availableManagers: availableManagersProcedure,
  info: infoProcedure,
});

export type AppRouter = typeof appRouter;
