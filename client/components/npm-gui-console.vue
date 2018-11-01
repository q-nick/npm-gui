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

  .session--error pre {
    background-color: #fff8f8;
    border-color: #d9534f;
  }

  .session--close pre {
    background-color: #fafff2;
    border-color: #79a736;
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
      v-bind:class="{
        'session--fullscreen': id === fullScreenSessionId,
        'session--new': session.status === 'NEW',
        'session--open': session.status === 'OPEN',
        'session--close': session.status === 'CLOSE',
        'session--error': session.status === 'ERROR',
      }"
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
          v-if="['CLOSE','ERROR'].includes(session.status)"
          v-on:click="onRemoveSession(id)"
        >remove</npm-gui-btn>
      </div>
      <pre><p>{{ session.msg }}</p></pre>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import NpmGuiBtn from './npm-gui-btn.vue';

  export default {
    components: {
      NpmGuiBtn,
    },
    created() {
      this.$store.dispatch('console/connect');
    },
    computed: mapState({ sessions: state => state.console.sessions }),
    data() {
      return {
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
      onRemoveSession(sessionId) {
        this.$store.dispatch('console/removeSession', sessionId);
      },
    },
  };
</script>
