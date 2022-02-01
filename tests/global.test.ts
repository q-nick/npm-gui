import api from 'supertest';
import { test } from 'tap';

import { app } from '../server';
import type { Basic } from '../server/types/Dependency';
import { HTTP_STATUS_OK } from '../server/utils/utils';

test('Global Packages', async (group) => {
  await group.test('install', async (t) => {
    const response = await api(app.server)
      .post('/api/global/dependencies')
      .send([{ name: 'npm-gui-tests', version: '1.0.0' }]);

    t.equal(response.status, HTTP_STATUS_OK, 'status');
  });

  await group.test('fast listing', async (t) => {
    const response = await api(app.server).get(
      '/api/global/dependencies/simple',
    );

    t.equal(response.status, HTTP_STATUS_OK, 'status');
    t.has(
      response.body.find((d: Basic) => d.name === 'npm-gui-tests'),
      { name: 'npm-gui-tests', manager: 'npm', installed: '1.0.0' },
      'has package',
    );
  });

  await group.test('full listing', async (t) => {
    const response = await api(app.server).get('/api/global/dependencies/full');

    t.equal(response.status, HTTP_STATUS_OK, 'status');
    t.has(
      response.body.find((d: Basic) => d.name === 'npm-gui-tests'),
      {
        name: 'npm-gui-tests',
        manager: 'npm',
        installed: '1.0.0',
        latest: '2.1.1',
      },
      'has package',
    );
  });

  await group.test('uninstalling', async (t) => {
    const response = await api(app.server).delete(
      '/api/global/dependencies/global/npm-gui-tests',
    );

    t.equal(response.status, HTTP_STATUS_OK, 'status');

    const responseListing = await api(app.server).get(
      '/api/global/dependencies/simple',
    );
    t.equal(responseListing.status, HTTP_STATUS_OK, 'status');
    t.has(
      responseListing.body.find((d: Basic) => d.name === 'npm-gui-tests'),
      undefined,
      'package deleted',
    );
  });
});
