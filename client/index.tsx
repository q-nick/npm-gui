/* eslint-disable no-console */
/* eslint-disable import/no-unassigned-import */
import './base.css';
import 'open-iconic/font/css/open-iconic.css';

import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import React from 'react';
import { render } from 'react-dom';

import { App } from './components/App';

const queryClient = new QueryClient();

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});

persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  // 60 min
  maxAge: 60 * 60 * 1000,
  dehydrateOptions: {
    shouldDehydrateQuery: ({ queryKey }) => {
      // persist only score and package details
      const [firstKey] = queryKey;
      return (
        typeof firstKey === 'string' &&
        ['get-dependencies-score', 'get-dependencies-details'].includes(
          firstKey,
        )
      );
    },
  },
});

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

if (!window.location.host.includes('1234')) {
  fetch('/api/log', {
    method: 'POST',
    body: JSON.stringify({ id: window.localStorage.getItem('npm-gui-id') }),
  });
}
