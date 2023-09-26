/* eslint-disable import/no-unassigned-import */
/* eslint-disable no-console */
import './base.css';

import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { httpBatchLink } from '@trpc/client';
import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './components/App';
import { trpc } from './trpc';

const queryClient = new QueryClient();

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: '/trpc',
    }),
  ],
});

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
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </trpc.Provider>
    </React.StrictMode>,
  );
}

if (window.localStorage.getItem('npm-gui-id') === null) {
  window.localStorage.setItem('npm-gui-id', Date.now().toString());
}
