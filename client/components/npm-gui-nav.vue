<style scoped rel="stylesheet/css">
  h1 {
    color: #fff;
    display: inline-block;
    font-size: 1em;
    font-weight: 400;
    line-height: 45px;
    margin: 0 15px 0 0;
  }

  nav {
    background: #3e3f3a;
    height: 45px;
    padding-left: 15px;
    padding-right: 15px;
    flex-basis: 45px;
  }

  .right-section {
    float: right;
  }
</style>

<template>
  <nav>
    <h1>npm-gui</h1>
    <npm-gui-btn
      v-for="button in buttons"
      class="dark"
      @click="onGoTo(button.routeName)"
      v-bind:key="button.text"
      >{{ button.text }}</npm-gui-btn>
    <div class="right-section">
      <npm-gui-project></npm-gui-project>
    </div>
  </nav>
</template>

<script>
  import NpmGuiBtn from './npm-gui-btn.vue';
  import NpmGuiProject from './npm-gui-project.vue';

  export default {
    components: {
      NpmGuiBtn,
      NpmGuiProject,
    },
    methods: {
      onGoTo(routeName) {
        this.$router.push({
          name: routeName,
          params: { projectPathEncoded: this.$route.params.projectPathEncoded },
        });
      },
    },
    data() {
      return {
        msg: 'Hello world!',
        buttons: [
          {
            text: 'Global Dependencies',
            routeName: 'dependencies-global',
            title: '',
          },
          {
            text: 'Dependencies',
            routeName: 'dependencies-regular',
            title: '',
          },
          {
            text: 'Dev Dependencies',
            routeName: 'dependencies-dev',
            title: '',
          },
          {
            text: 'Scripts',
            routeName: 'scripts',
            title: '',
          },
        ],
        currentProject: {
          name: 'npm-gui',
        },
      };
    },
  };
</script>
