import api from 'supertest';
import { test } from 'tap';

import { app } from '../server';
import { HTTP_STATUS_OK } from '../server/utils/utils';

test(`Package Managers`, async (group) => {
  await group.test('should return available package managers', async (t) => {
    const response = await api(app.server)
      .post('/api/search/npm')
      .send({ query: 'npm-gui-tests' });

    t.same(response.status, HTTP_STATUS_OK, 'status');

    t.has(
      response.body,
      [
        {
          name: 'npm-gui-tests',
          version: '2.1.1',
          url: 'https://github.com/q-nick/npm-gui-tests',
        },
      ],
      'found package',
    );
  });
});
