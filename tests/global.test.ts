import api from 'supertest';

import { app } from '../server';
import type { Basic } from '../server/types/dependency.types';
import { HTTP_STATUS_OK } from '../server/utils/utils';

describe('Global Packages', () => {
  test('install', async () => {
    const response = await api(app.server)
      .post('/api/global/dependencies')
      .send([{ name: 'npm-gui-tests', version: '1.0.0' }]);

    expect(response.status).toBe(HTTP_STATUS_OK);
  });

  test('fast listing', async () => {
    const response = await api(app.server).get(
      '/api/global/dependencies/simple',
    );

    expect(response.status).toBe(HTTP_STATUS_OK);
    expect(response.body).toPartiallyContain({
      name: 'npm-gui-tests',
      manager: 'npm',
      installed: '1.0.0',
    });
  });

  test('full listing', async () => {
    const response = await api(app.server).get('/api/global/dependencies/full');

    expect(response.status).toBe(HTTP_STATUS_OK);
    expect(response.body).toPartiallyContain({
      name: 'npm-gui-tests',
      manager: 'npm',
      installed: '1.0.0',
      latest: '2.1.1',
    });
  });

  test('uninstalling', async () => {
    const response = await api(app.server).delete(
      '/api/global/dependencies/global/npm-gui-tests',
    );

    expect(response.status).toBe(HTTP_STATUS_OK);

    const responseListing = await api(app.server).get(
      '/api/global/dependencies/simple',
    );
    expect(responseListing.status).toBe(HTTP_STATUS_OK);
    expect(
      responseListing.body.find((d: Basic) => d.name === 'npm-gui-tests'),
    ).toBe(undefined);
  });
});
