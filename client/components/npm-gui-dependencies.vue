<style scoped rel="stylesheet/css">
  .dependencies {
    display: flex;
    flex: 1;
    flex-direction: column;
    position: relative;
  }

  .table-container {
    border: 1px solid #dfd7ca;
    border-radius: 2px;
    margin-bottom: 15px;
    margin-top: 15px;
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

  .missing {
    color: #d9534f;
  }

  .spin {
    animation: spin 1s linear infinite;
    display: inline-block;
    vertical-align: middle;
  }

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
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
  <div class="dependencies">
    <header>
      <npm-gui-search></npm-gui-search>
      <div class="right">
        <npm-gui-btn
          class="primary small"
          icon="data-transfer-download"
          @click="onInstallAll()"
        >Install
        </npm-gui-btn>
        <npm-gui-btn
          class="success small"
          icon="cloud-download"
          @click="onInstallAllWanted()"
        >Use all installed as required
        </npm-gui-btn>
        <npm-gui-btn
          class="success small"
          icon="cloud-download"
          @click="onInstallAllWanted()"
        >Update all To Wanted
        </npm-gui-btn>
        <npm-gui-btn
          class="success small"
          icon="cloud-download"
          @click="onInstallAllLatest()"
        >Update all To Latest
        </npm-gui-btn>
        <npm-gui-btn
          class="danger small"
          icon="loop-circular"
          @click="onReinstallAll()"
        >Force Re-Install
        </npm-gui-btn>
      </div>
    </header>
    <div class="table-container">
      <table v-show="!loading">
        <tr>
          <!-- <th><input type="checkbox" style="display:inline;"/> <span>All</span></th> -->
          <th>Name</th>
          <th>Required</th>
          <th>NSP</th>
          <th>Installed</th>
          <th>Wanted</th>
          <th>Latest</th>
          <th>Action</th>
        </tr>
        <tr v-for="dependency in dependencies" v-bind:key="dependency.name" v-bind:class="{ loading: dependenciesLoading[dependency.name] }">
          <!-- <td><input type="checkbox" /></td> -->
          <td>
            {{ dependency.name }}
            <span class="label label--warning" v-if="dependency.repo === 'bower'">Bower</span>
            <span class="label label--danger" v-if="dependency.repo === 'npm'">npm</span>
          </td>
          <td class="column-version">
            {{ dependency.required || '' }}
            <span v-if="!dependency.required" class="missing">extrenous</span>
          </td>
          <td class="column-nsp"> ? </td>
          <td class="column-version">
            {{ dependency.installed || '' }}
            <span v-if="dependency.installed === undefined" class="oi spin" data-glyph="reload"></span>
            <span v-if="dependency.installed === null" class="missing">missing</span>
          </td>
          <td class="column-version">
            <npm-gui-btn
              :disabled="dependenciesLoading[dependency.name]"
              icon="cloud-download"
              v-if="dependency.wanted"
              class="success small"
              @click="onInstall(dependency, dependency.wanted)"
            >{{dependency.wanted}}</npm-gui-btn>
            <span v-if="dependency.wanted === null">-</span>
          </td>
          <td class="column-version">
            <npm-gui-btn
              :disabled="dependenciesLoading[dependency.name]"
              icon="cloud-download"
              v-if="dependency.latest"
              class="success small"
              @click="onInstall(dependency, dependency.latest)"
            >{{dependency.latest}}</npm-gui-btn>
            <span v-if="dependency.latest === null">-</span>
          </td>
          <td class="column-action">
            <npm-gui-btn
              :disabled="dependenciesLoading[dependency.name]"
              icon="trash"
              class="danger small"
              @click="onRemove(dependency)"
            >remove</npm-gui-btn>
            <!-- <npm-gui-btn icon="lock-locked" class="primary"></npm-gui-btn>
            <npm-gui-btn icon="external-link" class="warning"></npm-gui-btn> -->
          </td>
        </tr>
      </table>
      <div v-show="loading" class="loading">loading...</div>
      <div v-show="!loading && dependencies.length === 0" class="loading">just empty...</div>
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
      dependencies(state) {
        return state.dependencies[this.type].list;
      },
      loading(state) {
        return state.dependencies[this.type].status === 'loading';
      },
      dependenciesLoading(state) {
        return state.dependencies[this.type].executing;
      },
    }),
    data() {
      return {
        type: this.$route.meta.api.replace('dependencies/', ''),
      };
    },
    created() {
      this.loadDependencies();
    },
    watch: {
      $route() {
        this.loadDependencies();
      },
    },
    methods: {
      loadDependencies() {
        this.type = this.$route.meta.api.replace('dependencies/', '');

        this.$store.dispatch(`dependencies/${this.type}/load`, {
          project: this.$route.params.projectPathEncoded,
        });
      },

      onRemove(dependency) {
        this.$store.dispatch(`dependencies/${this.type}/delete`, {
          project: this.$route.params.projectPathEncoded,
          dependency,
        });
      },

      onInstall(dependency, version) {
        this.$store.dispatch(`dependencies/${this.type}/install`, {
          project: this.$route.params.projectPathEncoded,
          dependenciesToInstall: [{
            version,
            name: dependency.name,
            repo: dependency.repo,
          }],
        });
      },

      onInstallAll() {
        this.$store.dispatch(`dependencies/${this.type}/installAll`, {
          project: this.$route.params.projectPathEncoded,
          dependencies: this.dependencies,
        });
      },

      onReinstallAll() {
        this.$store.dispatch(`dependencies/${this.type}/reinstallAll`, {
          project: this.$route.params.projectPathEncoded,
          dependencies: this.dependencies,
        });
      },

      onInstallAllWanted() {
        const dependenciesToUpdate = this.dependencies.filter(dependency => dependency.wanted);

        this.$store.dispatch(`dependencies/${this.type}/install`, {
          project: this.$route.params.projectPathEncoded,
          dependenciesToInstall: dependenciesToUpdate
            .map(d => ({ name: d.name, version: d.wanted, repo: d.repo })),
        });
      },

      onInstallAllLatest() {
        const dependenciesToUpdate = this.dependencies.filter(dependency => dependency.latest);

        this.$store.dispatch(`dependencies/${this.type}/install`, {
          project: this.$route.params.projectPathEncoded,
          dependenciesToInstall: dependenciesToUpdate
            .map(d => ({ name: d.name, version: d.latest, repo: d.repo })),
        });
      },
    },
  };
</script>
