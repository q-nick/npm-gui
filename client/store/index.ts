import { StoreOptions } from 'vuex';

import { dependenciesFactory } from './modules/dependencies';
import scripts from './modules/scripts';
import console from './modules/console';

export const npmGuiStore: StoreOptions<State.Root> = {
  modules: {
    scripts,
    console,
    dependencies: {
      namespaced: true,
      modules: {
        project: dependenciesFactory(),
        global: dependenciesFactory(),
      },
    },
  },
};
