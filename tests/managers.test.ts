import api from 'supertest';

import { app } from '../server';
import { HTTP_STATUS_OK } from '../server/utils/utils';

describe(`Package Managers`, () => {
  test('should return available package managers', async () => {
    const response = await api(app.server).get('/api/available-managers/');
    expect(response.status).toBe(HTTP_STATUS_OK);

    expect(response.body).toEqual({
      npm: true,
      pnpm: true,
      yarn: true,
    });
  });
});
