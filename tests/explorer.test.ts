import path from 'path';
import api from 'supertest';
import { test } from 'tap';

import { app } from '../server';
import type { FileOrFolder } from '../server/actions/explorer/explorer';
import { HTTP_STATUS_OK } from '../server/utils/utils';
import { encodePath, prepareTestProject } from './tests-utils';

test(`Explorer`, async (group) => {
  await group.test(
    'should return result of pwd when given path is undefined',
    async (t) => {
      await prepareTestProject('npm');

      const response = await api(app.server).get('/api/explorer/');
      t.same(response.status, HTTP_STATUS_OK, 'status');
      t.notSame(response.body.path, undefined, 'path is defined');

      t.same(
        response.body.ls.find((entry: FileOrFolder) => entry.name === 'tests'),
        {
          isDirectory: true,
          isProject: false,
          name: 'tests',
        },
        'contain folder',
      );
    },
  );

  await group.test('should return result when path is defined', async (t) => {
    await prepareTestProject('yarn');

    const response = await api(app.server).get(
      `/api/explorer/${encodePath(path.join(__dirname, 'test-project'))}`,
    );
    t.same(response.status, HTTP_STATUS_OK, 'status');
    t.notSame(response.body.path, undefined, 'path is defined');

    t.same(
      response.body.ls.find(
        (entry: FileOrFolder) => entry.name === 'yarn.lock',
      ),
      {
        isDirectory: false,
        isProject: true,
        name: 'yarn.lock',
      },
      'contain yarn.lock',
    );

    t.same(
      response.body.ls.find(
        (entry: FileOrFolder) => entry.name === 'package.json',
      ),
      {
        isDirectory: false,
        isProject: true,
        name: 'package.json',
      },
      'contain package.json',
    );
  });
});
