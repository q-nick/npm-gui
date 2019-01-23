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

  .label--primary {
    background: #325d88;
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
        <small>Install:</small>
        <npm-gui-btn
          class="primary small"
          icon="data-transfer-download"
          @click="onInstallAll()"
        >All
        </npm-gui-btn>
        <npm-gui-btn
          class="primary small"
          icon="data-transfer-download"
          @click="onInstallAll()"
          disabled="disabled"
        >Dev
        </npm-gui-btn>
        <npm-gui-btn
          class="primary small"
          icon="data-transfer-download"
          @click="onInstallAll()"
          disabled="disabled"
        >Prod
        </npm-gui-btn>
        <small>Update all to:</small>
        <npm-gui-btn
          class="success small"
          icon="cloud-download"
          @click="onInstallAllToRequired()"
        >Installed
        </npm-gui-btn>
        <npm-gui-btn
          class="success small"
          icon="cloud-download"
          @click="onInstallAllWanted()"
        >Wanted
        </npm-gui-btn>
        <npm-gui-btn
          class="success small"
          icon="cloud-download"
          @click="onInstallAllLatest()"
        >Latest
        </npm-gui-btn>
        &nbsp;
        <npm-gui-btn
          class="danger small"
          icon="loop-circular"
          @click="onForceReinstallAll()"
        >Force Re-Install
        </npm-gui-btn>
      </div>
    </header>
    <div class="table-container">
      <table v-show="!loading">
        <tr>
          <!-- <th><input type="checkbox" style="display:inline;"/> <span>All</span></th> -->
          <npm-gui-th-sortable @click="onSortBy('type')" sort-match="type" :sort-key="sortKey" :sort-reversed="sortReversed">Env</npm-gui-th-sortable>
          <npm-gui-th-sortable @click="onSortBy('name')" sort-match="name" :sort-key="sortKey" :sort-reversed="sortReversed">Name</npm-gui-th-sortable>
          <npm-gui-th-sortable @click="onSortBy('required')" sort-match="required" :sort-key="sortKey" :sort-reversed="sortReversed">Required</npm-gui-th-sortable>
          <th>NSP</th>
          <npm-gui-th-sortable @click="onSortBy('installed')" sort-match="installed" :sort-key="sortKey" :sort-reversed="sortReversed">Installed</npm-gui-th-sortable>
          <npm-gui-th-sortable @click="onSortBy('wanted')" sort-match="wanted" :sort-key="sortKey" :sort-reversed="sortReversed">Wanted</npm-gui-th-sortable>
          <npm-gui-th-sortable @click="onSortBy('latest')" sort-match="latest" :sort-key="sortKey" :sort-reversed="sortReversed">Latest</npm-gui-th-sortable>
          <th>Action</th>
        </tr>
        <tr v-for="dependency in dependencies" v-bind:key="dependency.name" v-bind:class="{ loading: dependenciesLoading[dependency.name] }">
          <!-- <td><input type="checkbox" /></td> -->
          <td>
            <span v-if="dependency.type !== 'regular'">{{ dependency.type }}</span>
          </td>
          <td>
            {{ dependency.name }}
            <span class="label label--warning" v-if="dependency.repo === 'bower'">Bower</span>
            <span class="label label--danger" v-if="dependency.repo === 'npm'">npm</span>
            <span class="label label--primary" v-if="dependency.repo === 'yarn'">yarn</span>
          </td>
          <td class="column-version">
            {{ dependency.required || '' }}
            <span v-if="!dependency.required" class="missing">extraneous</span>
          </td>
          <td class="column-nsp"> ? </td>
          <td class="column-version">
            <span v-if="dependency.installed && getNormalizedVersion(dependency.required) === dependency.installed">{{ dependency.installed }}</span>
            <span v-if="dependency.installed === undefined" class="oi spin" data-glyph="reload"></span>
            <span v-if="dependency.installed === null" class="missing">missing</span>
            <npm-gui-btn
              :disabled="dependenciesLoading[dependency.name]"
              icon="cloud-download"
              v-if="dependency.installed && getNormalizedVersion(dependency.required) !== dependency.installed"
              class="success small"
              @click="onInstall(dependency, dependency.installed)"
            >{{dependency.installed}}</npm-gui-btn>
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
  import NpmGuiThSortable from './npm-gui-th-sortable.vue';

  export default {
    components: {
      NpmGuiBtn,
      NpmGuiSearch,
      NpmGuiInfo,
      NpmGuiThSortable,
    },
    computed: mapState({
      dependencies(state) {
        const { sortKey } = state.dependencies[this.type];
        const { sortReversed } = state.dependencies[this.type];
        let dependencies = state.dependencies[this.type].list;
        if (sortKey) {
          dependencies = dependencies.sort((a, b) => {
            if (!a[sortKey] && !b[sortKey]) { return 0; }
            if (!a[sortKey] || a[sortKey] < b[sortKey]) { return -1; }
            if (!b[sortKey] || a[sortKey] > b[sortKey]) { return 1; }
            return 0;
          });
        }
        if (sortReversed) {
          dependencies = dependencies.reverse();
        }
        return dependencies;
      },
      loading(state) {
        return state.dependencies[this.type].status === 'loading';
      },
      sortKey(state) {
        return state.dependencies[this.type].sortKey;
      },
      sortReversed(state) {
        return state.dependencies[this.type].sortReversed;
      },
      dependenciesLoading(state) {
        return state.dependencies[this.type].executing;
      },
    }),
    data() {
      return {
        type: this.$route.meta.api,
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
      getNormalizedVersion(version) {
        if (!version) {
          return null;
        }
        const [normalized] = version.match(/\d.+/);
        return normalized;
      },

      loadDependencies() {
        this.type = this.$route.meta.api;

        this.$store.dispatch(`dependencies/${this.type}/load`, {
          project: this.type === 'project' ? this.$route.params.projectPathEncoded : null,
        });
      },

      onRemove(dependency) {
        this.$store.dispatch(`dependencies/${this.type}/delete`, {
          project: this.type === 'project' ? this.$route.params.projectPathEncoded : null,
          dependency,
        });
      },

      onInstall(dependency, version) {
        this.$store.dispatch(`dependencies/${this.type}/install`, {
          project: this.type === 'project' ? this.$route.params.projectPathEncoded : null,
          dependenciesToInstall: [{
            version,
            name: dependency.name,
            repo: dependency.repo,
            type: dependency.type,
          }],
        });
      },

      onInstallAll() {
        this.$store.dispatch(`dependencies/${this.type}/installAll`, {
          project: this.type === 'project' ? this.$route.params.projectPathEncoded : null,
          dependencies: this.dependencies,
        });
      },

      onSortBy(sortKey) {
        this.$store.dispatch(`dependencies/${this.type}/sortBy`, sortKey);
      },

      onForceReinstallAll() {
        this.$store.dispatch(`dependencies/${this.type}/forceReinstallAll`, {
          project: this.type === 'project' ? this.$route.params.projectPathEncoded : null,
          dependencies: this.dependencies,
        });
      },

      onInstallAllWanted() {
        const dependenciesToUpdate = this.dependencies.filter(dependency => dependency.wanted);

        this.$store.dispatch(`dependencies/${this.type}/install`, {
          project: this.type === 'project' ? this.$route.params.projectPathEncoded : null,
          dependenciesToInstall: dependenciesToUpdate
            .map(d => ({
              name: d.name, version: d.wanted, repo: d.repo, type: d.type,
            })),
        });
      },

      onInstallAllLatest() {
        const dependenciesToUpdate = this.dependencies.filter(dependency => dependency.latest);

        this.$store.dispatch(`dependencies/${this.type}/install`, {
          project: this.type === 'project' ? this.$route.params.projectPathEncoded : null,
          dependenciesToInstall: dependenciesToUpdate
            .map(d => ({
              name: d.name, version: d.latest, repo: d.repo, type: d.type,
            })),
        });
      },

      onInstallAllToRequired() {
        const dependenciesToUpdate = this.dependencies
          .filter(dependency => this
            .getNormalizedVersion(dependency.required) !== dependency.installed);

        this.$store.dispatch(`dependencies/${this.type}/install`, {
          project: this.type === 'project' ? this.$route.params.projectPathEncoded : null,
          dependenciesToInstall: dependenciesToUpdate
            .map(d => ({
              name: d.name, version: d.installed, repo: d.repo, type: d.type,
            })),
        });
      },
    },
  };
</script>
