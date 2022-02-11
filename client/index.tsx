/* eslint-disable import/no-unassigned-import */
import './base.css';
import 'open-iconic/font/css/open-iconic.css';

import React from 'react';
import { render } from 'react-dom';

import { App } from './components/App';

render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.querySelector('.npm-gui'),
);

if (window.localStorage.getItem('npm-gui-id') === null) {
  window.localStorage.setItem('npm-gui-id', Date.now().toString());
}

if (window.localStorage.getItem('npm-gui-id') !== 'developer') {
  void fetch('/api/log', {
    method: 'POST',
    body: JSON.stringify({ id: window.localStorage.getItem('npm-gui-id') }),
  });
}
