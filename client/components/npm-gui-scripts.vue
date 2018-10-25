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

  iframe {
    border: 0;
    height: 50px;
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
        <tr v-for="script in scripts" v-bind:key="script.name" v-bind:class="{ loading: scriptsLoading[script.name] }">
          <td class="column-run">
            <npm-gui-btn
              :disabled="scriptsLoading[script.name]"
              icon="media-play"
              class="primary small"
              @click="onRun(script)"
            >run</npm-gui-btn>
          </td>
          <td class="column-name">{{ script.name }}</td>
          <td class="column-command"><pre>{{ script.command }}</pre></td>
          <td class="column-action">
            <npm-gui-btn
              :disabled="scriptsLoading[script.name]"
              icon="trash"
              class="danger small"
              @click="onRemove(script)"
            ></npm-gui-btn>
          </td>
        </tr>
      </table>
      <div v-show="loading" class="loading">loading...</div>
    </div>
    <iframe src="http://https://q-nick.github.io/npm-gui/"></iframe>
  </div>
</template>

<script>
  import axios from 'axios';

  import NpmGuiBtn from './npm-gui-btn.vue';
  import NpmGuiSearch from './npm-gui-search.vue';

  export default {
    components: {
      NpmGuiBtn,
      NpmGuiSearch,
    },
    data() {
      return {
        loading: false,
        error: null,
        scripts: {},
        scriptsLoading: {},
      };
    },
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
        this.loading = true;
        axios
          .get(`/api/project/${this.$route.params.projectPathEncoded}/scripts`)
          .then((response) => {
            this.loading = false;
            this.error = null;
            this.scripts = response.data;
          })
          .catch((error) => {
            this.loading = false;
            this.error = error;
          });
      },

      onRemove(script) {
        this.scriptsLoading = {
          ...this.scriptsLoading,
          [script.name]: true,
        };

        axios
          .delete(`/api/project/${this.$route.params.projectPathEncoded}/scripts/${script.name}`)
          .then(() => {
            this.loadScripts();
          });
      },

      onAdd(script) {
        this.scriptsLoading = {
          ...this.scriptsLoading,
          [script.name]: true,
        };

        axios
          .post(`/api/project/${this.$route.params.projectPathEncoded}/scripts`, script)
          .then(() => {
            this.loadScripts();
          });
      },

      onRun(script) {
        this.scriptsLoading = {
          ...this.scriptsLoading,
          [script.name]: true,
        };

        axios
          .post(`/api/project/${this.$route.params.projectPathEncoded}/scripts/${script.name}/run`)
          .then(() => {
            this.scriptsLoading = {
              ...this.scriptsLoading,
              [script.name]: false,
            };
          });
      },
    },
  };
</script>
