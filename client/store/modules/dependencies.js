import axios from 'axios';

const getters = {
};

function getBasePathFor(project) {
  if (project) {
    return `/api/project/${project}/dependencies`;
  }

  return 'api/global';
}

const actions = {
  async load({ commit }, { project }) {
    commit('setListStatus', 'loading');

    const responseSimple = await axios
      .get(`${getBasePathFor(project)}/simple`);

    commit('setListStatus', 'loaded');
    commit('setDependencies', responseSimple.data);

    const responseFull = await axios
      .get(`${getBasePathFor(project)}`);

    commit('setDependencies', responseFull.data);
  },

  async installAll({ commit, dispatch }, { project, dependencies }) {
    dependencies.forEach(dependency => commit('setDependencyExecutingStart', dependency.name));

    await axios.post(`${getBasePathFor(project)}/npm/install`, {});
    await axios.post(`${getBasePathFor(project)}/bower/install`, {});

    dependencies.forEach(dependency => commit('setDependencyExecutingStop', dependency.name));
    dispatch('load', { project });
  },

  async reinstallAll({ commit, dispatch }, { project, dependencies }) {
    dependencies.forEach(dependency => commit('setDependencyExecutingStart', dependency.name));

    await axios.post(`${getBasePathFor(project)}/reinstall`, {});

    dependencies.forEach(dependency => commit('setDependencyExecutingStop', dependency.name));
    dispatch('load', { project });
  },

  async install({ commit, dispatch }, { project, dependenciesToInstall }) {
    dependenciesToInstall.forEach(dependencyToInstall => commit('setDependencyExecutingStart', dependencyToInstall.name));

    const npmDependencies = dependenciesToInstall.filter(d => d.repo === 'npm');
    const npmDependenciesDev = npmDependencies.filter(d => d.type === 'dev');
    const npmDependenciesRegular = npmDependencies.filter(d => d.type === 'regular');

    const bowerDependencies = dependenciesToInstall.filter(d => d.repo === 'bower');
    const bowerDependenciesDev = bowerDependencies.filter(d => d.type === 'dev');
    const bowerDependenciesRegular = bowerDependencies.filter(d => d.type === 'regular');

    await axios.post(`${getBasePathFor(project)}/dev/npm`,
      npmDependenciesDev
        .map(dependencyToInstall => ({ packageName: dependencyToInstall.name, version: dependencyToInstall.version }))); // eslint-disable-line
    await axios.post(`${getBasePathFor(project)}/regular/npm`,
      npmDependenciesRegular
        .map(dependencyToInstall => ({ packageName: dependencyToInstall.name, version: dependencyToInstall.version }))); // eslint-disable-line

    await axios.post(`${getBasePathFor(project)}/dev/bower`,
      bowerDependenciesDev
        .map(dependencyToInstall => ({ packageName: dependencyToInstall.name, version: dependencyToInstall.version }))); // eslint-disable-line
    await axios.post(`${getBasePathFor(project)}/regular/bower`,
      bowerDependenciesRegular
        .map(dependencyToInstall => ({ packageName: dependencyToInstall.name, version: dependencyToInstall.version }))); // eslint-disable-line

    dependenciesToInstall.forEach(dependencyToInstall => commit('setDependencyExecutingStop', dependencyToInstall.name));
    dispatch('load', { project });
  },

  async delete({ commit, dispatch }, { project, dependency }) {
    commit('setDependencyExecutingStart', dependency.name);

    await axios
      .delete(`${getBasePathFor(project)}/${dependency.repo}/${dependency.name}`);

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

export function dependenciesFactory() {
  return {
    namespaced: true,
    state: {
      list: null,
      status: null,
      executing: {},
    },
    getters,
    actions,
    mutations,
  };
}
