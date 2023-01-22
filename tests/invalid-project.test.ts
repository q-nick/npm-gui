import { ensureDir } from 'fs-extra';
import path from 'path';
import api from 'supertest';

import { app } from '../server';
import { HTTP_STATUS_BAD_REQUEST } from '../server/utils/utils';
import { encodePath } from './tests-utils';

describe(`Invalid project for npm `, () => {
  test('should throw error', async () => {
    const testDirectoryPath = path.join(__dirname, 'test-project', 'invalid');

    await ensureDir(testDirectoryPath);
    const encodedTestDirectoryPath = encodePath(testDirectoryPath);

    const response = await api(app.server).get(
      `/api/project/${encodedTestDirectoryPath}/dependencies/install`,
    );

    expect(response.status).toBe(HTTP_STATUS_BAD_REQUEST);
  });
});
