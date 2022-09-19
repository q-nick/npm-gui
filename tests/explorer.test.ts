import path from 'path';
import api from 'supertest';

import { app } from '../server';
import { HTTP_STATUS_OK } from '../server/utils/utils';
import { encodePath, prepareTestProject } from './tests-utils';

describe(`Explorer`, () => {
  test('should return result of pwd when given path is undefined', async () => {
    const project = await prepareTestProject('explorer', 'npm');
    await project.prepareClear({});

    const response = await api(app.server).get('/api/explorer/');
    expect(response.status).toBe(HTTP_STATUS_OK);
    expect(response.body.path).not.toBe(undefined);

    expect(response.body.ls).toPartiallyContain({
      isDirectory: true,
      isProject: false,
      name: 'tests',
    });
  });

  test('should return result when path is defined', async () => {
    const project = await prepareTestProject('explorer', 'yarn');
    await project.prepareClear({});

    const response = await api(app.server).get(
      `/api/explorer/${encodePath(
        path.join(__dirname, 'test-project-yarn', 'explorer'),
      )}`,
    );
    expect(response.status).toBe(HTTP_STATUS_OK);
    expect(response.body.path).not.toBe(undefined);

    expect(response.body.ls).toPartiallyContain({
      isDirectory: false,
      isProject: false,
      name: 'somefile',
    });

    expect(response.body.ls).toPartiallyContain({
      isDirectory: false,
      isProject: true,
      name: 'yarn.lock',
    });

    expect(response.body.ls).toPartiallyContain({
      isDirectory: false,
      isProject: true,
      name: 'package.json',
    });
  });
});
