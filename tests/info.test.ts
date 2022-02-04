import api from 'supertest';
import { test } from 'tap';

import { app } from '../server';
import { HTTP_STATUS_OK } from '../server/utils/utils';

test(`Info`, async (group) => {
  await group.test('should return 200', async (t) => {
    const response = await api(app.server).get('/api/info');

    t.same(response.status, HTTP_STATUS_OK, 'status');
  });
});