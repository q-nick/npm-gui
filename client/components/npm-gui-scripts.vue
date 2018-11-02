<style scoped rel="stylesheet/css">
  .scripts {
    display: flex;
    flex: 1;
    flex-direction: column;
    position: relative;
  }

  .table-container {
    border: 1px solid #dfd7ca;
    border-radius: 2px;
    margin-bottom: 15px;
    margin-top: 40px;
    overflow: auto;
    flex: 1;
  }

  td,
  th {
    padding: 3px 10px;
    text-align: center;
  }

  td:first-child,
  th:first-child {
    text-align: left;
  }

  .right {
    float: right;
  }

  .label {
    border-radius: 2px;
    color: #fff;
    float: right;
    font-size: 0.8em;
    font-weight: bold;
    padding: 0.2em 0.4em;
  }

  .label--danger {
    background: #d9534f;
  }

  .label--warning {
    background: #ef5c0e;
  }

  .loading {
    margin-top: 10vh;
    text-align: center;
  }

  .column-action {
    width: 11em;
  }

  .column-nsp {
    width: 8em;
  }

  .column-version {
    width: 10%;
  }

  tr.loading {
    background: linear-gradient(-45deg, #dfd7ca, #fff);
    background-size: 200% 200%;
    animation: Gradient 2s ease infinite;
  }

  pre {
    background: black;
    display: inline-block;
    color: white;
    padding: 6px;
    border-radius: 4px;
    margin: 4px;
  }

  @keyframes Gradient {
    0% {
      background-position: 0% 50%;
    }

    50% {
      background-position: 100% 50%;
    }

    100% {
      background-position: 0% 50%;
    }
  }

  input {
    display: inline-block;
  }
</style>

<template>
  <div class="scripts">
    <div class="table-container">
      <table v-show="!loading">
        <tr>
          <th>Run</th>
          <th>Name</th>
          <th>Command</th>
          <th>Action</th>
        </tr>
        <tr>
          <td class="column-run">add new:</td>
          <td class="column-name"><input type="text"></td>
          <td class="column-command"><input type="text"></td>
          <td class="column-action">
            <npm-gui-btn
              icon="plus"
              class="success small"
              @click="onAdd()"
            ></npm-gui-btn>
          </td>
        </tr>
        <tr>
          <th>Run</th>
          <th>Name</th>
          <th>Command</th>
          <th>Action</th>
        </tr>
        <tr v-for="script in scripts" v-bind:key="script.name" v-bind:class="{ loading: executing[script.name] }">
          <td class="column-run">
            <npm-gui-btn
              :disabled="executing[script.name]"
              icon="media-play"
              class="primary small"
              @click="onRun(script)"
            >run</npm-gui-btn>
          </td>
          <td class="column-name">{{ script.name }}</td>
          <td class="column-command"><pre>{{ script.command }}</pre></td>
          <td class="column-action">
            <npm-gui-btn
              :disabled="executing[script.name]"
              icon="trash"
              class="danger small"
              @click="onRemove(script)"
            >remove</npm-gui-btn>
          </td>
        </tr>
      </table>
      <div v-show="loading" class="loading">loading...</div>
      <div v-show="!loading && scripts.length === 0" class="loading">just empty...</div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  import NpmGuiBtn from './npm-gui-btn.vue';
  import NpmGuiSearch from './npm-gui-search.vue';
  import NpmGuiInfo from './npm-gui-info.vue';

  export default {
    components: {
      NpmGuiBtn,
      NpmGuiSearch,
      NpmGuiInfo,
    },
    computed: mapState({
      scripts: state => state.scripts.list,
      loading: state => state.scripts.status === 'loading',
      executing: state => state.scripts.executing,
    }),
    created() {
      this.loadScripts();
    },
    watch: {
      $route() {
        this.loadScripts();
      },
    },
    methods: {
      loadScripts() {
        this.$store.dispatch('scripts/load', {
          project: this.$route.params.projectPathEncoded,
        });
      },

      onRemove(script) {
        this.$store.dispatch('scripts/delete', {
          project: this.$route.params.projectPathEncoded,
          scriptName: script.name,
        });
      },

      onAdd() {},

      onRun(script) {
        this.$store.dispatch('scripts/run', {
          project: this.$route.params.projectPathEncoded,
          scriptName: script.name,
        });
      },
    },
  };
</script>
