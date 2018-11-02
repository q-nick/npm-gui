<style scoped rel="stylesheet/css">
  .npm-gui-info {
    border: 0;
    height: 50px;
  }
</style>

<template>
    <div class="npm-gui-info">{{ content }}</div>
</template>

<script>
  import axios from 'axios';

  export default {
    created() {
      this.loadInfo();
    },
    methods: {
      loadInfo() {
        axios
          .get('/api/info')
          .then((response) => {
            this.content = response;
          });
      },
    },
  };
</script>
