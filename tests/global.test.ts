import { spawnSync } from 'child_process';
import { readJSONSync, writeJSONSync } from 'fs-extra';
import path from 'path';
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

  test('weird behavior when global package is missing its version', async () => {
    await api(app.server)
      .post('/api/global/dependencies')
      .send([{ name: 'npm-gui-tests', version: '1.0.0' }]);

    // find package.json in global folder
    const packageJSONPath = path.join(
      spawnSync('npm', ['root', '-g'], { shell: process.platform === 'win32' })
        .stdout.toString()
        .replace(/[\n\r]/gm, ''),
      'npm-gui-tests',
      'package.json',
    );

    // remove version from package.json
    const packageJSON = readJSONSync(packageJSONPath);
    delete packageJSON.version;
    writeJSONSync(packageJSONPath, packageJSON);

    const response = await api(app.server).get(
      '/api/global/dependencies/simple',
    );

    expect(response.body).toPartiallyContain({
      installed: null,
      manager: 'npm',
      name: 'npm-gui-tests',
      type: 'global',
    });
  });
});
