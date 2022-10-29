import api from 'supertest';

import { app } from '../server';
import { HTTP_STATUS_OK } from '../server/utils/utils';

describe(`Package Managers`, () => {
  test('should return available package managers', async () => {
    const response = await api(app.server)
      .post('/api/search/npm')
      .send({ query: 'npm-gui-tests' });

    expect(response.status).toBe(HTTP_STATUS_OK);

    expect(response.body).toPartiallyContain({
      name: 'npm-gui-tests',
      version: '2.1.1',
      repository: 'https://github.com/q-nick/npm-gui-tests',
    });
  });
});
