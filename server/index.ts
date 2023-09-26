import { createHTTPServer } from '@trpc/server/adapters/standalone';

import { appRouter } from './trpc/router';

const DEFAULT_PORT = 3000;
const DEFAULT_HOST = 'localhost';

/* istanbul ignore next */
export const start = (
  host = DEFAULT_HOST,
  port = DEFAULT_PORT,
  openBrowser = false,
) => {
  createHTTPServer({
    router: appRouter,
  }).listen(port, host);

  if (openBrowser) {
    // open(`http://${host}:${port}`);
  }
};
