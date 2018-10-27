<style scoped rel="stylesheet/css">
  .console {
    display: flex;
    flex-direction: column;
    flex: 1;
    position: relative;
  }

  .session {
    display: flex;
    flex: 1;
    padding-bottom: 0;
    padding-top: 15px;
    transition: flex 1500ms ease-in-out;
  }

  .session:hover {
    flex: 100;
  }

  pre {
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
      <div class="right">
        <npm-gui-btn
          class="danger small"
          icon="delete"
          v-on:click="clear()"
        >Clear
        </npm-gui-btn>
      </div>
    </header>
    <!-- <pre><p>{{log}}</p></pre> -->
    tu:{{ sessions2 }}
    <div v-for="(session, id) in sessions" v-bind:key="id" class="session">
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
      };
    },
    methods: {
      clear() {
        this.sessions = {
          default: this.sessions.default,
        };
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
