import { dependenciesFactory } from './modules/dependencies';
import scripts from './modules/scripts';
import console from './modules/console';

export const npmGuiStore = {
  modules: {
    dependencies: {
      namespaced: true,
      modules: {
        project: dependenciesFactory(),
        global: dependenciesFactory(),
      },
    },
    scripts,
    console,
  },
};
