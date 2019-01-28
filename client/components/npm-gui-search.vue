<style scoped rel="stylesheet/css">
.npm-gui-search {
  background: #fff;
  border: 1px solid #fff;
  border-radius: 2px;
  margin-left: -7.5px;
  margin-top: -7.5px;
  max-height: 34px;
  max-width: 120px;
  overflow: hidden;
  padding: 7.5px;
  position: absolute;
  transition: max-width 300ms, max-height 300ms;
  z-index: 1;
}

.npm-gui-search--open {
  border-color: #dfd7ca;
  max-height: 100%;
  max-width: 100%;
}

form {
  margin-bottom: 6px;
  margin-top: 6px;
}

input,
select {
  display: inline-block;
  width: 7em;
  vertical-align: middle;
}

input:disabled,
select:disabled {
  background: lightgray;
  cursor: not-allowed;
}

.table-container {
  max-height: 50vh;
  overflow-y: scroll;
}

td {
  text-align: center;
}

span {
  min-width: 45px;
  display: inline-block;
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
</style>

<template>
  <div class="npm-gui-search" v-bind:class="{'npm-gui-search--open': isOpen}">
    <npm-gui-btn class="primary small" icon="plus" @click="toggle">Search / Add</npm-gui-btn>
    <form action @submit="onSearch">
      <select name id v-model="searchRepo" @change="onSearch" :disabled="loading">
        <option value="npm">npm</option>
        <option value="bower">bower</option>
      </select>
      <input type="text" v-model="searchQuery" placeholder="type name" :disabled="loading">
      <npm-gui-btn class="success" @click="onSearch" :disabled="loading">
        <span v-if="!loading">search</span>
        <span v-if="loading" class="oi spin" data-glyph="reload"></span>
      </npm-gui-btn>
    </form>
    <div class="table-container">
      <table v-if="searchResults.length">
        <tr>
          <th>score</th>
          <th>name</th>
          <th>version</th>
          <th>github</th>
          <th>action</th>
        </tr>
        <tr v-for="result in searchResults" v-bind:key="result.name">
          <td>{{ (result.score * 100).toFixed(2) }}%</td>
          <td :title="result.description">
            <strong>{{ result.name }}</strong>
          </td>
          <td :title="result.description">{{ result.version }}</td>
          <td>
            <a :href="result.url" target="_blank">show repo</a>
          </td>
          <td>
            <npm-gui-btn class="info small" @click="onInstall(result.name, 'regular')">install prod</npm-gui-btn>
            <npm-gui-btn class="info small" @click="onInstall(result.name, 'dev')">install dev</npm-gui-btn>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import debounce from "debounce";
import NpmGuiBtn from "./npm-gui-btn.vue";

export default {
  components: {
    NpmGuiBtn
  },
  data() {
    return {
      loading: false,
      isOpen: false,
      searchRepo: "npm",
      searchQuery: "",
      searchResults: []
    };
  },

  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    },

    onInstall(toInstall, type) {
      const name = toInstall.includes("@")
        ? toInstall.split("@")[0]
        : toInstall;
      const version = toInstall.includes("@") ? toInstall.split("@")[1] : null;

      this.$store.dispatch(`dependencies/project/install`, {
        project: this.$route.params.projectPathEncoded, // TODO global
        dependenciesToInstall: [
          {
            version,
            name,
            repo: this.searchRepo,
            type
          }
        ]
      });

      this.searchQuery = "";
      this.isOpen = false;
    },

    onSearch(event) {
      event.preventDefault();
      if (this.searchQuery) {
        this.loading = true;
        this.searchResults = [];

        axios
          .post(`/api/search/${this.searchRepo}`, {
            query: this.searchQuery
          })
          .then(response => {
            this.loading = false;
            this.error = null;
            this.searchResults = response.data;
          })
          .catch(error => {
            this.loading = false;
            this.error = error;
          });
      }
    }
  }
};
</script>
