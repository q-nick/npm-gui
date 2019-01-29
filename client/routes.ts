import * as NpmGuiProject from './containers/npm-gui-project.vue';
import * as NpmGuiScripts from './components/npm-gui-scripts.vue';
import * as NpmGuiDependencies from './components/npm-gui-dependencies.vue';

export const routes = [{
  path: '/project/:projectPathEncoded',
  component: { template: '<router-view></router-view>' },
  children: [{
    path: 'dependencies',
    name: 'dependencies',
    component: NpmGuiProject,
    meta: {
      api: 'project',
    },
  }, {
    path: 'global',
    name: 'global',
    component: NpmGuiDependencies,
    meta: {
      api: 'global',
    },
  }, {
    path: 'scripts',
    name: 'scripts',
    component: NpmGuiScripts,
  }],
}, {
  path: '*',
  redirect: { name: 'dependencies' },
}];
