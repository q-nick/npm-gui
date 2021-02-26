import * as ReactDOM from 'react-dom';
import axios from 'axios';

import { App } from './app/App';
import './base.css';

const xCacheId = new Date().getTime();
axios.interceptors.request.use((config) => ({
  ...config,
  headers: { // eslint-disable-line
    ...config.headers,
    'x-cache-id': xCacheId
  }
}));

ReactDOM.render(
  <App />,
  document.querySelector('.npm-gui'),
);

if (window.localStorage.getItem('npm-gui-id') !== null) {
  window.localStorage.setItem('npm-gui-id', new Date().toString());
}

if (window.localStorage.getItem('npm-gui-id') !== 'developer') {
  void axios.post('/api/log', { id: window.localStorage.getItem('npm-gui-id') });
}
