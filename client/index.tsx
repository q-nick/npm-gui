import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import axios from 'axios';

import { App } from './app/App';
import './base.css';
import { stores } from './stores';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ProjectContainer } from './containers/ProjectContainer';

const xCacheId = new Date().getTime();
axios.interceptors.request.use(config =>
  ({ ...config, headers: { ...config.headers, 'x-cache-id': xCacheId } }));

ReactDOM.render(
  <Provider {...stores}>
    <Router>
      <Switch>
        <Route
          path={'/project/:projectPathEncoded'}
          component={App}
        />
        {/* simple workaround to get initial project path */}
        <Route path="*" exact={true} component={ProjectContainer} />
      </Switch>
    </Router>
  </Provider>
  ,
  document.querySelector('.npm-gui'));

if (!window.localStorage.getItem('npm-gui-id')) {
  window.localStorage.setItem('npm-gui-id', new Date().toString());
}

if (window.localStorage.getItem('npm-gui-id') !== 'developer') {
  axios.post('/api/log', { id: window.localStorage.getItem('npm-gui-id') });
}
