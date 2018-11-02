<style scoped rel="stylesheet/css">
  .npm-gui-info {
    border: 0;
    height: 50px;
  }
</style>

<template>
    <div class="npm-gui-info" v-html="content"></div>
</template>

<script>
  import axios from 'axios';

  export default {
    created() {
      this.loadInfo();
    },
    data() {
      return {
        content: null,
      };
    },
    methods: {
      loadInfo() {
        axios
          .get('/api/info')
          .then((response) => {
            this.content = response.data;
          });
      },
    },
  };
</script>
