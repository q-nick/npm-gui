import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';

import { App } from './app/App';
import './base.css';
import { stores } from './stores';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.render(
  <Provider {...stores}>
    <Router>
      <App />
    </Router>
  </Provider>
  ,
  document.querySelector('.npm-gui'));
