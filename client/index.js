import 'normalize.css';
import Vue from 'vue';
import VueRouter from 'vue-router';
import 'open-iconic'; // eslint-disable-line

import './base.css';
import NpmGuiNav from './components/npm-gui-nav.vue';
import NpmGuiConsole from './components/npm-gui-console.vue';

import { routes } from './routes';

Vue.use(VueRouter);

function initialize() {
  const router = new VueRouter({
    routes,
  });

  const app = new Vue({
    components: {
      NpmGuiNav,
      NpmGuiConsole,
    },
    router,
  }).$mount('#npm-gui-vue');

  return app;
}

initialize();
