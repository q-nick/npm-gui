import NpmGuiDependencies from './components/npm-gui-dependencies.vue';
import NpmGuiScripts from './components/npm-gui-scripts.vue';

export const routes = [{
  path: '/project/:projectPathEncoded',
  component: { template: '<router-view></router-view>' },
  children: [{
    path: 'dependencies',
    name: 'dependencies',
    component: NpmGuiDependencies,
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
