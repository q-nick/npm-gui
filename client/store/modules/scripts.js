import axios from 'axios';

const scriptsState = {
  list: null,
  status: null,
  executing: {},
};

const getters = {
};

const actions = {
  async load({ commit }, { project }) {
    commit('setListStatus', 'loading');

    const { data } = await axios.get(`/api/project/${project}/scripts`);

    commit('setListStatus', 'loaded');
    commit('setScripts', data);
  },

  async run({ commit }, { project, scriptName }) {
    commit('setScriptExecuting', { scriptName, status: true });

    await axios.get(`/api/project/${project}/scripts/${scriptName}/run`);

    commit('setScriptExecuting', { scriptName, status: false });
  },

  async delete({ commit, dispatch }, { project, scriptName }) {
    commit('setScriptExecuting', { scriptName, status: true });

    await axios.delete(`/api/project/${project}/scripts/${scriptName}`);

    commit('setScriptExecuting', { scriptName, status: false });
    dispatch('load', { project });
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
