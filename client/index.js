import 'normalize.css';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex'
import 'open-iconic'; // eslint-disable-line

import './base.css';
import NpmGuiNav from './components/npm-gui-nav.vue';
import NpmGuiConsole from './components/npm-gui-console.vue';

import { routes } from './routes';

Vue.use(VueRouter);
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    count: 0,
    sessions: 'wtf',
  },
  mutations: {
    increment(state) {
      state.count += 1;
    },
  },
});

function initialize() {
  const router = new VueRouter({
    routes,
  });

  const app = new Vue({
    components: {
      NpmGuiNav,
      NpmGuiConsole,
    },
    store,
    router,
  }).$mount('#npm-gui-vue');

  return app;
}

initialize();
