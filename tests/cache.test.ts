/* eslint-disable max-statements */
import type api from 'supertest';

import { HTTP_STATUS_OK } from '../server/utils/utils';
import type { TestProject } from './tests-utils';
import { managers, prepareTestProject, TEST } from './tests-utils';

const withTimeExecution = async <T>(
  callback: () => Promise<T>,
): Promise<[number, T]> => {
  const start = Date.now();
  const returnValue = await callback();
  const executionTime = Date.now() - start;

  return [executionTime, returnValue];
};

describe.each(managers)('%s cache fetching', (manager) => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let project: TestProject;

  beforeAll(async () => {
    project = await prepareTestProject('install');
  });

  test('next full response calls should be faster than first', async () => {
    await project.prepareClear({
      manager,
      dependencies: {
        'npm-gui-tests': '^1.0.0',
        'npm-gui-tests-2': '^1.0.0',
      },
      install: true,
    });

    const [executionTime1] = await withTimeExecution<api.Response>(
      async () => await project.requestGetFull(),
    );
    expect(executionTime1).toBeGreaterThan(10);

    const [executionTime2] = await withTimeExecution<api.Response>(
      async () => await project.requestGetFull(),
    );
    expect(executionTime2).toBeLessThan(10);

    const [executionTime3] = await withTimeExecution<api.Response>(
      async () => await project.requestGetFull(),
    );
    expect(executionTime3).toBeLessThan(10);

    expect(executionTime2).toBeLessThan(executionTime1);
    expect(executionTime3).toBeLessThan(executionTime1);
  });

  test('cache update on add/delete dependency', async () => {
    await project.prepareClear({
      manager,
      dependencies: {
        'npm-gui-tests': '^1.0.0',
      },
      install: true,
    });

    // create cache request
    const response0 = await project.requestGetFull();
    expect(response0.status).toBe(HTTP_STATUS_OK);
    expect(response0.body).toIncludeAllMembers([TEST[manager].PKG_A_INSTALLED]);

    // update cache request (new dependency)
    const response1 = await project.requestAdd('prod', [
      { name: 'npm-gui-tests-2', version: '^1.0.0' },
    ]);
    expect(response1.status).toBe(HTTP_STATUS_OK);

    // listing
    const [executionTime1, full1] = await withTimeExecution<api.Response>(
      async () => await project.requestGetFull(),
    );
    expect(executionTime1).toBeLessThan(10);
    expect(full1.body).toIncludeAllMembers([
      TEST[manager].PKG_A_INSTALLED,
      TEST[manager].PKG_B_UP_INSTALLED,
    ]);

    // update cache request (already installed dependency)
    const response3 = await project.requestAdd('prod', [
      { name: 'npm-gui-tests', version: '^2.1.1' },
    ]);
    expect(response3.status).toBe(HTTP_STATUS_OK);

    // listing
    const [executionTime2, full2] = await withTimeExecution<api.Response>(
      async () => await project.requestGetFull(),
    );
    expect(executionTime2).toBeLessThan(10);
    expect(full2.body).toIncludeAllMembers([
      TEST[manager].PKG_A_UP_NEWEST,
      TEST[manager].PKG_B_UP_INSTALLED,
    ]);

    // update cache request (remove installed dependency)
    const response2 = await project.requestDel('prod', 'npm-gui-tests');
    expect(response2.status).toBe(HTTP_STATUS_OK);

    // listing
    const [executionTime3, full3] = await withTimeExecution<api.Response>(
      async () => await project.requestGetFull(),
    );
    expect(executionTime3).toBeLessThan(10);
    expect(full3.body).toIncludeAllMembers([TEST[manager].PKG_B_UP_INSTALLED]);
    expect(full3.body).toHaveLength(1);

    // update cache request (remove unknown dependency)
    const response4 = await project.requestDel('prod', 'asdfasdfasdf');
    expect(response4.status).toBe(HTTP_STATUS_OK);
  });
});
