import 'normalize.css'; // eslint-disable-line
import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import axios from 'axios';
import 'open-iconic'; // eslint-disable-line

import './base.css';
// import * as NpmGuiNav from './components/npm-gui-nav';
// import * as NpmGuiConsole from './components/npm-gui-console';
// import * as NpmGuiInfo from './components/npm-gui-info';

// import { routes } from './routes';

import { npmGuiStore } from './store';

Vue.use(VueRouter);
Vue.use(Vuex);

const store = new Vuex.Store<State.Root>(npmGuiStore);

function initialize():void {
  // const router = new VueRouter({
  //   routes,
  // });

  new Vue({
    store,
    // router,
    components: {
      // NpmGuiNav,
      // NpmGuiConsole,
      // NpmGuiInfo,
    },
  }).$mount('#npm-gui-vue');

  if (!window.localStorage.getItem('npm-gui-id')) {
    window.localStorage.setItem('npm-gui-id', new Date().toString());
  }
  axios.post('/api/log', { id: window.localStorage.getItem('npm-gui-id') });
}

initialize();
