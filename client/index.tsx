/* eslint-disable import/no-unassigned-import */
import './base.css';
import 'open-iconic/font/css/open-iconic.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { render } from 'react-dom';

import { App } from './components/App';

const queryClient = new QueryClient();

render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
  document.querySelector('.npm-gui'),
);

if (window.localStorage.getItem('npm-gui-id') === null) {
  window.localStorage.setItem('npm-gui-id', Date.now().toString());
}

if (window.localStorage.getItem('npm-gui-id') !== 'developer') {
  fetch('/api/log', {
    method: 'POST',
    body: JSON.stringify({ id: window.localStorage.getItem('npm-gui-id') }),
  });
}
