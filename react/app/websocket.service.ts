// const consoleSocket = new WebSocket(`ws://${window.location.host}/api/console`);
// consoleSocket.onmessage = msg => commit('addMessageToSession', JSON.parse(msg.data));
// consoleSocket.onopen = () => commit('setConnected', true);
// consoleSocket.onclose = () => {
//   commit('addMessageToSession', { id: 'default', msg: 'disconnected\n' });
//   commit('setConnected', false);
//   setTimeout(() => dispatch('connect'), 1000);
// };

