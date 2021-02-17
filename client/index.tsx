import * as React from 'react';
import * as ReactDOM from 'react-dom';
import axios from 'axios';

import { App } from './app/App';
import './base.css';

const xCacheId = new Date().getTime();
axios.interceptors.request.use((config) => ({ ...config, headers: { ...config.headers, 'x-cache-id': xCacheId } }));

ReactDOM.render(
  <App />,
  document.querySelector('.npm-gui'),
);

if (!window.localStorage.getItem('npm-gui-id')) {
  window.localStorage.setItem('npm-gui-id', new Date().toString());
}

if (window.localStorage.getItem('npm-gui-id') !== 'developer') {
  axios.post('/api/log', { id: window.localStorage.getItem('npm-gui-id') });
}
