<style scoped rel="stylesheet/css">
  .container {
    display: inline-block;
    position: relative;
  }

  .explorer {
    position: absolute;
    background: #3e3f3a;
    right: 0;
    top: 100%;
    z-index: 1;
    max-height: 0;
    overflow: hidden;
    margin: 0;
    padding: 0;
    width: 200px;
  }

  .explorer--open {
    border-color: #dfd7ca;
    max-height: 80vh;
    overflow-y: scroll;
  }

  .folder,
  .project {
    color: #fff;
    background: none;
    font-size: 12px;
    font-weight: 500;
    border: 0;
    display: inline-block;
    width: 100%;
    text-align: left;
    padding: 0 8px;
  }

  .project {
    color: #d9534f;
  }

  .project:hover {
    color: #000;
  }

  .folder:hover,
  .project:hover {
    text-decoration: underline;
    background: #8e8c84;
  }

  .file {
    color: #8e8c84;
    font-size: 12px;
    font-weight: 500;
    padding: 0 8px;
  }

  p {
    color: #dfd7ca;
    display: inline-block;
    font-size: 0.9em;
    font-weight: 400;
    line-height: 45px;
    margin: 0;
  }
</style>

<template>
  <div
    class="container"
  >
    <p>Current Project path: {{ projectPathDecoded() }}</p>
    <npm-gui-btn class="dark" icon="folder" @click="onToggle"></npm-gui-btn>
    <ul
      class="explorer"
      v-bind:class="{'explorer--open': isOpen}"
      v-if="explorer"
    >
      <li>
        <button class="folder" @click="onSelectPath(`${explorer.path}/../`)">../</button>
      </li>
      <li v-for="folderOrFile in explorer.ls" v-bind:key="folderOrFile.name">
        <button
          class="folder"
          v-if="folderOrFile.isDirectory && !folderOrFile.isProject"
          @click="onSelectPath(`${explorer.path}/${folderOrFile.name}`)"
        ><span class="oi" data-glyph="folder"></span> {{ folderOrFile.name }}/</button>
        <button
          class="project"
          v-if="folderOrFile.isProject"
          @click="onSelectProjectPath(explorer.path)"
        ><span class="oi" data-glyph="arrow-thick-right"></span> {{ folderOrFile.name }}</button>
        <span class="file" v-if="!folderOrFile.isDirectory && !folderOrFile.isProject"><span class="oi" data-glyph="file"></span> {{ folderOrFile.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  import axios from 'axios';
  import NpmGuiBtn from './npm-gui-btn.vue';

  export default {
    components: {
      NpmGuiBtn,
    },
    data() {
      return {
        isOpen: false,
        explorer: null,
      };
    },
    created() {
      this.loadPath();
    },
    methods: {
      projectPathDecoded() {
        return this.$route.params.projectPathEncoded
          ? window.atob(this.$route.params.projectPathEncoded) : null;
      },

      onToggle() {
        this.isOpen = !this.isOpen;
      },

      onSelectPath(selectedPath) {
        this.loadPath(window.btoa(selectedPath));
      },

      onSelectProjectPath(selectedProjectPath) {
        this.$router.push({ params: { projectPathEncoded: window.btoa(selectedProjectPath) } });
        this.isOpen = false;
      },

      loadPath(encodedPath) {
        this.loading = true;
        axios
          .get(`/api/explorer/${encodedPath || ''}`)
          .then((response) => {
            this.loading = false;
            this.error = null;
            this.explorer = response.data;
            if (!this.$route.params.projectPathEncoded) {
              this.onSelectProjectPath(response.data.path);
            }
          })
          .catch((error) => {
            this.loading = false;
            this.error = error;
          });
      },
    },
  };
</script>
