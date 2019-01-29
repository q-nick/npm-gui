import axios from 'axios';
import { Module, ActionTree, MutationTree, GetterTree } from 'vuex';

const getters: GetterTree<State.Dependencies, State.Root> = {
};

function getBasePathFor(project: string): string {
  if (project) {
    return `/api/project/${project}/dependencies`;
  }

  return 'api/global';
}

const mutations: MutationTree<State.Dependencies> = {
  setSortKey(state, sortKey: string): void {
    if (state.sortKey === sortKey) {
      state.sortReversed = !state.sortReversed;
    } else {
      state.sortReversed = false;
    }
    state.sortKey = sortKey;
  },
  setListStatus(state, status: State.Status): void {
    state.status = status;
  },
  setDependencies(state, dependencies): void {
    state.list = dependencies;
  },
  setDependencyExecutingStart(state, dependencyName: string): void {
    state.executing = {
      ...state.executing,
      [dependencyName]: true,
    };
  },
  setDependencyExecutingStop(state, dependencyName: string): void {
    state.executing = {
      ...state.executing,
      [dependencyName]: false,
    };
  },
};

const actions: ActionTree<State.Dependencies, State.Root> = {
  sortBy({ commit }, sortKey: string): void {
    commit('setSortKey', sortKey);
  },

  async load({ commit }, { project }: Action.Project): Promise<void> {
    commit('setListStatus', 'loading');

    const responseSimple = await axios
      .get(`${getBasePathFor(project)}/simple`);

    commit('setListStatus', 'loaded');
    commit('setDependencies', responseSimple.data);

    const responseFull = await axios
      .get(`${getBasePathFor(project)}`);

    commit('setDependencies', responseFull.data);
  },

  async installAll({ commit, dispatch }, { project, dependencies }: Action.Dependencies)
    : Promise<void> {
    dependencies.forEach(dependency => commit('setDependencyExecutingStart', dependency.name));

    await axios.post(`${getBasePathFor(project)}/install`, {});

    dependencies.forEach(dependency => commit('setDependencyExecutingStop', dependency.name));
    dispatch('load', { project });
  },

  async forceReinstallAll({ commit, dispatch }, { project, dependencies }: Action.Dependencies)
    : Promise<void> {
    dependencies.forEach(dependency => commit('setDependencyExecutingStart', dependency.name));

    await axios.post(`${getBasePathFor(project)}/install/force`, {});

    dependencies.forEach(dependency => commit('setDependencyExecutingStop', dependency.name));
    dispatch('load', { project });
  },

  async install({ commit, dispatch }, { project, dependencies }: Action.Dependencies)
    : Promise<void> {
    dependencies.forEach(
      dependencyToInstall => commit('setDependencyExecutingStart', dependencyToInstall.name));

    const npmDependencies = dependencies.filter(d => d.repo === 'npm');
    const npmDependenciesDev = npmDependencies.filter(d => d.type === 'dev');
    const npmDependenciesProd = npmDependencies.filter(d => d.type === 'prod');

    const bowerDependencies = dependencies.filter(d => d.repo === 'bower');
    const bowerDependenciesDev = bowerDependencies.filter(d => d.type === 'dev');
    const bowerDependenciesProd = bowerDependencies.filter(d => d.type === 'prod');

    if (npmDependenciesProd.length) {
      await axios.post(
        `${getBasePathFor(project)}/prod/npm`,
        npmDependenciesProd
          .map(d => ({ name: d.name, version: d.version })));
    }

    if (npmDependenciesDev.length) {
      await axios.post(
        `${getBasePathFor(project)}/dev/npm`,
        npmDependenciesDev
          .map(d => ({ name: d.name, version: d.version })));
    }

    if (bowerDependenciesProd.length) {
      await axios.post(
        `${getBasePathFor(project)}/prod/bower`,
        bowerDependenciesProd
          .map(d => ({ name: d.name, version: d.version })));
    }

    if (bowerDependenciesDev.length) {
      await axios.post(
        `${getBasePathFor(project)}/dev/bower`,
        bowerDependenciesDev
          .map(d => ({ name: d.name, version: d.version })));
    }

    dependencies.forEach(d => commit('setDependencyExecutingStop', d.name));

    dispatch('load', { project });
  },

  async delete({ commit, dispatch }, { project, dependency }): Promise<void> {
    const { name, repo, type } = dependency;
    commit('setDependencyExecutingStart', name);

    await axios.delete(`${getBasePathFor(project)}/${type}/${repo}/${name}`);

    commit('setDependencyExecutingStop', name);
    dispatch('load', { project });
  },
};

const state: State.Dependencies = {
  list: null,
  status: null,
  sortKey: null,
  scripts: null,
  sortReversed: false,
  executing: {},
};

export function dependenciesFactory(): Module<State.Dependencies, State.Root> {
  return {
    getters,
    actions,
    mutations,
    state,
    namespaced: true,
  };
}
