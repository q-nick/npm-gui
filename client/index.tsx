/* eslint-disable no-console */
/* eslint-disable import/no-unassigned-import */
import './base.css';

import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import React from 'react';
import { createRoot } from 'react-dom/client';

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

const container = document.querySelector('.npm-gui');

if (container) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>,
  );
}

if (window.localStorage.getItem('npm-gui-id') === null) {
  window.localStorage.setItem('npm-gui-id', Date.now().toString());
}
