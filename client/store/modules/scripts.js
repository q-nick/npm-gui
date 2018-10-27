import axios from 'axios';

const scriptsState = {
  list: null,
  status: null,
  executing: {},
};

const getters = {
};

const actions = {
  load({ commit }, { project }) {
    commit('setListStatus', 'loading');

    axios
      .get(`/api/project/${project}/scripts`)
      .then((response) => {
        commit('setListStatus', 'loaded');
        commit('setScripts', response.data);
      });
  },

  run({ commit }, { project, scriptName }) {
    commit('setScriptExecuting', { scriptName, status: true });

    axios
      .get(`/api/project/${project}/scripts/${scriptName}/run`)
      .then(() => {
        commit('setScriptExecuting', { scriptName, status: false });
      });
  },

  delete({ commit, dispatch }, { project, scriptName }) {
    commit('setScriptExecuting', { scriptName, status: true });
    axios
      .delete(`/api/project/${project}/scripts/${scriptName}`)
      .then(() => {
        commit('setScriptExecuting', { scriptName, status: false });
        dispatch('load', { project });
      });
  },
};

const mutations = {
  setListStatus(state, status) {
    state.status = status;
  },
  setScripts(state, scripts) {
    state.list = scripts;
  },
  setScriptExecuting(state, { scriptName, status }) {
    state.executing = {
      ...state.executing,
      [scriptName]: status,
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
