import { ensureDir } from 'fs-extra';
import path from 'path';
import api from 'supertest';
import { test } from 'tap';

import { app } from '../server';
import { HTTP_STATUS_BAD_REQUEST } from '../server/utils/utils';
import { encodePath } from './tests-utils';

test(`Invalid project for npm `, async (group) => {
  await group.test('should throw error', async (t) => {
    const testDirectoryPath = path.join(__dirname, 'test-project', 'invalid');

    await ensureDir(testDirectoryPath);
    const encodedTestDirectoryPath = encodePath(testDirectoryPath);

    const response = await api(app.server).get(
      `/api/project/${encodedTestDirectoryPath}/dependencies/install/`,
    );

    t.same(response.status, HTTP_STATUS_BAD_REQUEST, 'status');
  });
});
