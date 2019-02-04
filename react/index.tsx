import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';

import { App } from './app/App';
import './base.css';
import { stores } from './stores';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ProjectContainer } from './containers/ProjectContainer';

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
