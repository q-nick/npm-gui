<style scoped rel="stylesheet/css">
  .console {
    display: flex;
    flex-direction: column;
    flex: 1;
    position: relative;
  }

  header {
    min-height: 26px;
  }

  .session {
    display: flex;
    flex: 1;
    padding-bottom: 0;
    padding-top: 15px;
    position: relative;
    width: 100%;
    transition: flex 1500ms ease-in-out, width 1000ms ease-in-out;
    overflow: hidden;
    z-index: 1;
  }

  .session:hover {
    flex: 100;
    z-index: 2;
  }

  .session__menu {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    text-align: right;
    padding-top: 20px;
    padding-right: 5px;
    z-index: 1;
    opacity: 0;
    transition: opacity 500ms ease-in-out;
  }

  .session:hover > .session__menu {
    opacity: 1;
  }

  .session:hover.session--fullscreen {
    width: 200%;
  }

  pre {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid #dfd7ca;
    border-radius: 2px;
    color: #8e8c84;
    font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
    font-size: 0.8em;
    overflow: auto;
    padding: 7px;
    position: relative;
    word-break: break-all;
    word-wrap: break-word;
    flex: 1;
    margin: 0;
    white-space: pre-wrap;
  }

  p {
    left: 7px;
    position: absolute;
    top: 7px;
    margin: 0;
  }

  header p {
    display: inline-block;
    margin: 0;
  }

  .right {
    float: right;
  }
</style>

<template>
  <div class="console">
    <header>
      <p><span class="oi" data-glyph="terminal"></span> Console</p>
    </header>
    <div
      v-for="(session, id) in sessions"
      v-bind:key="id"
      class="session"
      v-bind:class="{'session--fullscreen': id === fullScreenSessionId}"
    >
      <div class="session__menu">
        <npm-gui-btn
          class="primary small"
          icon="fullscreen-enter"
          v-if="id !== fullScreenSessionId"
          v-on:click="onEnterFullScreenSession(id)"
        >Enlarge</npm-gui-btn>
        <npm-gui-btn
          class="primary small"
          icon="fullscreen-exit"
          v-if="id === fullScreenSessionId"
          v-on:click="onClearFullScreenSession()"
        >Shrink</npm-gui-btn>
        <npm-gui-btn
          class="danger small"
          icon="x"
          v-if="session.status === 'LIVE'"
          v-on:click="onClearFullScreenSession()"
        >Cancel/Stop</npm-gui-btn>
        <npm-gui-btn
          class="danger small"
          icon="fullscreen-exit"
          v-if="session.status === 'CLOSE'"
          v-on:click="onClearFullScreenSession()"
        >clear</npm-gui-btn>
      </div>
      <pre><p>{{ session.msg }}{{ session.status }}</p></pre>
    </div>
  </div>
</template>

<script>
  import NpmGuiBtn from './npm-gui-btn.vue';

  export default {
    components: {
      NpmGuiBtn,
    },
    created() {
      this.connectConsole();
    },
    computed: {
      sessions2() {
        console.log(this.$store);
        return this.$store.state.sessions;
      },
    },
    data() {
      return {
        sessions: {},
        fullScreenSessionId: null,
      };
    },
    methods: {
      clear() {
        this.sessions = {
          default: this.sessions.default,
        };
      },
      onEnterFullScreenSession(id) {
        this.fullScreenSessionId = id;
      },
      onClearFullScreenSession() {
        this.fullScreenSessionId = null;
      },
      connectConsole() {
        const consoleSocket = new WebSocket(`ws://${location.host}/api/console`);// eslint-disable-line
        consoleSocket.onmessage = this.onNewMessage.bind(this);
        consoleSocket.onclose = this.onClose.bind(this);
      },
      onClose() {
        setTimeout(() => this.connectConsole(), 1000);
      },
      onNewMessage(msg) {
        const message = JSON.parse(msg.data);
        if (!this.sessions[message.id]) {
          this.sessions[message.id] = {
            status: 'NEW',
            msg: '',
          };
        }

        this.sessions = {
          ...this.sessions,
          [message.id]: {
            ...this.sessions[message.id],
            msg: this.sessions[message.id].msg + message.msg,
            status: message.status,
          },
        };
      },
    },
  };
</script>
