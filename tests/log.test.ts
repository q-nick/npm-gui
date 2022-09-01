import api from 'supertest';

import { app } from '../server';
import { HTTP_STATUS_OK } from '../server/utils/utils';

describe(`Logging`, () => {
  test('should return 200', async () => {
    const response = await api(app.server).get('/api/log');

    expect(response.status).toBe(HTTP_STATUS_OK);
  });
});
