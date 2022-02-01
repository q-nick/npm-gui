import api from 'supertest';
import { test } from 'tap';

import { app } from '../server';
import { HTTP_STATUS_OK } from '../server/utils/utils';

test(`Package Managers`, async (group) => {
  await group.test('should return available package managers', async (t) => {
    const response = await api(app.server).get('/api/available-managers/');
    t.same(response.status, HTTP_STATUS_OK, 'status');

    t.same(
      response.body,
      {
        npm: true,
        pnpm: true,
        yarn: true,
      },
      'all package managers should be available',
    );
  });
});
