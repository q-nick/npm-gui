import axios from 'axios';

const getters = {
};

const actions = {
  async load({ commit, state }, { project }) {
    commit('setListStatus', 'loading');

    const responseSimple = await axios
      .get(`/api/project/${project}/dependencies/${state.type}/simple`);

    commit('setListStatus', 'loaded');
    commit('setDependencies', responseSimple.data);

    const responseFull = await axios
      .get(`/api/project/${project}/dependencies/${state.type}`);

    commit('setDependencies', responseFull.data);
  },

  async install({ commit, dispatch, state }, { project, dependency, version }) {
    commit('setDependencyExecutingStart', dependency.name);

    await axios.post(`/api/project/${project}/dependencies/${state.type}/${dependency.repo}`,
      { packageName: dependency.name, version });

    commit('setDependencyExecutingStop', dependency.name);
    dispatch('load', { project });
  },

  async installMany({ commit, dispatch, state }, { project, dependenciesToInstall }) {
    dependenciesToInstall.forEach(dependencyToInstall => commit('setDependencyExecutingStart', dependencyToInstall.name));

    await axios.post(`/api/project/${project}/dependencies/${state.type}/npm`,
      dependenciesToInstall
        .filter(dependencyToInstall => dependencyToInstall.repo === 'npm')
        .map(dependencyToInstall => ({ packageName: dependencyToInstall.name, version: dependencyToInstall.version }))); // eslint-disable-line

    await axios.post(`/api/project/${project}/dependencies/${state.type}/bower`,
      dependenciesToInstall
        .filter(dependencyToInstall => dependencyToInstall.repo === 'bower')
        .map(dependencyToInstall => ({ packageName: dependencyToInstall.name, version: dependencyToInstall.version }))); // eslint-disable-line

    dependenciesToInstall.forEach(dependencyToInstall => commit('setDependencyExecutingStop', dependencyToInstall.name));
    dispatch('load', { project });
  },

  async delete({ commit, dispatch, state }, { project, dependency }) {
    commit('setDependencyExecutingStart', dependency.name);

    await axios
      .delete(`/api/project/${project}/dependencies/${state.type}/${dependency.repo}/${dependency.name}`);

    commit('setDependencyExecutingStop', dependency.name);
    dispatch('load', { project });
  },
};

const mutations = {
  setListStatus(state, status) {
    state.status = status;
  },
  setDependencies(state, dependencies) {
    state.list = dependencies;
  },
  setDependencyExecutingStart(state, dependencyName) {
    state.executing = {
      ...state.executing,
      [dependencyName]: true,
    };
  },
  setDependencyExecutingStop(state, dependencyName) {
    state.executing = {
      ...state.executing,
      [dependencyName]: false,
    };
  },
};

export function dependenciesFactory(type) {
  return {
    namespaced: true,
    state: {
      type,
      list: null,
      status: null,
      executing: {},
    },
    getters,
    actions,
    mutations,
  };
}
