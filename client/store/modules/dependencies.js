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
  load({ commit }, { project, type }) {
    commit('setListStatus', { type, status: 'loading' });

    axios
      .get(`/api/project/${project}/dependencies/${type}/simple`)
      .then((response) => {
        commit('setListStatus', { type, status: 'loaded' });
        commit('setDependencies', { type, dependencies: response.data });

        axios
          .get(`/api/project/${project}/dependencies/${type}`)
          .then((response2) => {
            commit('setDependencies', { type, dependencies: response2.data });
          });
      });
  },

  run({ commit }, { project, scriptName }) {
    commit('setDependencyExecuting', { scriptName, status: true });

    axios
      .get(`/api/project/${project}/scripts/${scriptName}/run`)
      .then(() => {
        commit('setDependencyExecuting', { scriptName, status: false });
      });
  },

  delete({ commit, dispatch }, { project, scriptName }) {
    commit('setDependencyExecuting', { scriptName, status: true });
    axios
      .delete(`/api/project/${project}/scripts/${scriptName}`)
      .then(() => {
        commit('setDependencyExecuting', { scriptName, status: false });
        dispatch('load', { project });
      });
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
      ...state.executing,
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
