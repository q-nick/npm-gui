import { MutationTree } from "vuex";

const consoleState = {
  connected: false,
  sessions: {},
};

const getters = {
};

const mutations: MutationTree<State.Console> = {
  addMessageToSession(state, message):void {
    if (!state.sessions[message.id]) {
      state.sessions[message.id] = {
        status: 'NEW',
        msg: '',
      };
    }

    state.sessions = {
      ...state.sessions,
      [message.id]: {
        ...state.sessions[message.id],
        msg: state.sessions[message.id].msg + message.msg,
        status: message.status,
      },
    };
  },
  setConnected(state, connected):void {
    state.connected = connected;
  },
  deleteSession(state, sessionIdToDelete):void {
    const sessionsFiltered = {};

    Object.keys(state.sessions)
      .filter(sessionId => sessionIdToDelete !== sessionId)
      .forEach((sessionId) => {
        sessionsFiltered[sessionId] = state.sessions[sessionId];
      });

    state.sessions = sessionsFiltered;
  },
};

const actions: ActionTree<State.Dependencies, State.Root> = {
  async connect({ commit, state, dispatch }):Promise<void> {
    if (!state.connected) {
      commit('addMessageToSession', { id: 'default', msg: 'connecting\n' });
    }

    const consoleSocket = new WebSocket(`ws://${window.location.host}/api/console`);
    consoleSocket.onmessage = msg => commit('addMessageToSession', JSON.parse(msg.data));
    consoleSocket.onopen = () => commit('setConnected', true);
    consoleSocket.onclose = () => {
      commit('addMessageToSession', { id: 'default', msg: 'disconnected\n' });
      commit('setConnected', false);
      setTimeout(() => dispatch('connect'), 1000);
    };
  },

  removeSession({ commit }, sessionId):void {
    commit('deleteSession', sessionId);
  },
};

export default {
  getters,
  actions,
  mutations,
  namespaced: true,
  state: consoleState,
};
