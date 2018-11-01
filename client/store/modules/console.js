const consoleState = {
  connected: false,
  sessions: {},
};

const getters = {
};


const actions = {
  async connect({ commit, state, dispatch }) {
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

  removeSession({ commit }, sessionId) {
    commit('deleteSession', sessionId);
  },
};

const mutations = {
  addMessageToSession(state, message) {
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
  setConnected(state, connected) {
    state.connected = connected;
  },
  deleteSession(state, sessionIdToDelete) {
    const sessionsFiltered = {};
    console.log(sessionIdToDelete);

    Object.keys(state.sessions)
      .filter(sessionId => sessionIdToDelete !== sessionId)
      .forEach((sessionId) => {
        sessionsFiltered[sessionId] = state.sessions[sessionId];
      });

    state.sessions = sessionsFiltered;
  },
};

export default {
  namespaced: true,
  state: consoleState,
  getters,
  actions,
  mutations,
};
