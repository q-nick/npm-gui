import axios from 'axios';
import { ActionTree, GetterTree, MutationTree } from 'vuex';

const getters: GetterTree<State.Scripts, State.Root> = {
};

const mutations: MutationTree<State.Dependencies> = {
  setListStatus(state, status): void {
    state.status = status;
  },
  setScripts(state, scripts): void {
    state.list = scripts;
  },
  setScriptExecuting(state, { scriptName, status }): void {
    state.executing = {
      ...state.executing,
      [scriptName]: status,
    };
  },
};

const actions: ActionTree<State.Scripts, State.Root> = {
  async load({ commit }, { project }): Promise<void> {
    commit('setListStatus', 'loading');

    const { data } = await axios.get(`/api/project/${project}/scripts`);

    commit('setListStatus', 'loaded');
    commit('setScripts', data);
  },

  async run({ commit }, { project, scriptName }): Promise<void> {
    commit('setScriptExecuting', { scriptName, status: true });

    await axios.get(`/api/project/${project}/scripts/${scriptName}/run`);

    commit('setScriptExecuting', { scriptName, status: false });
  },

  async delete({ commit, dispatch }, { project, scriptName }): Promise<void> {
    commit('setScriptExecuting', { scriptName, status: true });

    await axios.delete(`/api/project/${project}/scripts/${scriptName}`);

    commit('setScriptExecuting', { scriptName, status: false });
    dispatch('load', { project });
  },
};

const state: State.Scripts = {
  list: null,
  status: null,
  executing: {},
};

export default {
  getters,
  actions,
  mutations,
  state,
  namespaced: true,
};
