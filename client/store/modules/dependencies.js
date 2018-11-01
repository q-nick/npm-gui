import axios from 'axios';

const scriptsState = {
  dev: {
    list: null,
    status: null,
    executing: {},
  },
  regular: {
    list: null,
    status: null,
    executing: {},
  },
};

const getters = {
};

const actions = {
  async load({ commit }, { project, type }) {
    commit('setListStatus', { type, status: 'loading' });
    console.log('wtf2');

    const responseSimple = await axios
      .get(`/api/project/${project}/dependencies/${type}/simple`);

    commit('setListStatus', { type, status: 'loaded' });
    commit('setDependencies', { type, dependencies: responseSimple.data });

    const responseFull = await axios
      .get(`/api/project/${project}/dependencies/${type}`);

    commit('setDependencies', { type, dependencies: responseFull.data });
  },

  async install({ commit, dispatch }, {
    project, type, dependency, version,
  }) {
    commit('setDependencyExecuting', { type, dependencyName: dependency.name, status: true });

    await axios.post(`/api/project/${project}/dependencies/${type}/${dependency.repo}`,
      { packageName: dependency.name, version });
    console.log('wtf');
    commit('setDependencyExecuting', { type, dependencyName: dependency.name, status: false });
    dispatch('load', { project, type });
  },

  async delete({ commit, dispatch }, { project, type, dependency }) {
    commit('setDependencyExecuting', { type, dependencyName: dependency.name, status: true });

    await axios
      .delete(`/api/project/${project}/dependencies/${type}/${dependency.repo}/${dependency.name}`);

    commit('setDependencyExecuting', { type, dependencyName: dependency.name, status: false });
    dispatch('load', { project, type });
  },
};

const mutations = {
  setListStatus(state, { type, status }) {
    state[type].status = status;
  },
  setDependencies(state, { type, dependencies }) {
    state[type].list = dependencies;
  },
  setDependencyExecuting(state, { type, dependencyName, status }) {
    state[type].executing = {
      ...state[type].executing,
      [dependencyName]: status,
    };
  },
};

export default {
  namespaced: true,
  state: scriptsState,
  getters,
  actions,
  mutations,
};
