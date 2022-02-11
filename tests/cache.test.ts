/* eslint-disable max-statements */
import type api from 'supertest';
import { test } from 'tap';

import { HTTP_STATUS_OK } from '../server/utils/utils';
import { nextManager, prepareTestProject, TEST } from './tests-utils';

const withTimeExecution = async <T>(
  callback: () => Promise<T>,
): Promise<[number, T]> => {
  const start = Date.now();
  const returnValue = await callback();
  const executionTime = Date.now() - start;

  return [executionTime, returnValue];
};

nextManager(async (manager) => {
  const project = await prepareTestProject(`cache`);
  await test(`${manager} cache fetching`, async (group) => {
    await group.test(
      'next full response calls should be faster than first',
      async (t) => {
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
        t.ok(executionTime1 > 5, 'execution time huge');

        const [executionTime2] = await withTimeExecution<api.Response>(
          async () => await project.requestGetFull(),
        );
        t.ok(executionTime2 < 5, 'execution time nearly instant');

        const [executionTime3] = await withTimeExecution<api.Response>(
          async () => await project.requestGetFull(),
        );
        t.ok(executionTime3 < 5, 'execution time nearly instant');

        t.ok(
          executionTime2 < executionTime1,
          'next requests should be faster than first',
        );
        t.ok(
          executionTime3 < executionTime1,
          'next requests should be faster than first',
        );
      },
    );

    group.test('cache update on add/delete dependency', async (t) => {
      await project.prepareClear({
        manager,
        dependencies: {
          'npm-gui-tests': '^1.0.0',
        },
        install: true,
      });

      // create cache request
      const response0 = await project.requestGetFull();
      t.same(response0.status, HTTP_STATUS_OK, 'status');
      t.has(response0.body, [TEST[manager].PKG_A_INSTALLED], 'dependencies');

      // update cache request (new dependency)
      const response1 = await project.requestAdd('prod', [
        { name: 'npm-gui-tests-2', version: '^1.0.0' },
      ]);
      t.same(response1.status, HTTP_STATUS_OK, 'status');

      // listing
      const [executionTime1, full1] = await withTimeExecution<api.Response>(
        async () => await project.requestGetFull(),
      );
      t.ok(executionTime1 < 5, 'execution time nearly instant');
      t.has(
        full1.body,
        [TEST[manager].PKG_A_INSTALLED, TEST[manager].PKG_B_UP_INSTALLED],
        'dependencies',
      );

      // update cache request (already installed dependency)
      const response3 = await project.requestAdd('prod', [
        { name: 'npm-gui-tests', version: '^2.1.1' },
      ]);
      t.same(response3.status, HTTP_STATUS_OK, 'status');

      // listing
      const [executionTime2, full2] = await withTimeExecution<api.Response>(
        async () => await project.requestGetFull(),
      );
      t.ok(executionTime2 < 5, 'execution time nearly instant');
      t.has(
        full2.body,
        [TEST[manager].PKG_A_UP_NEWEST, TEST[manager].PKG_B_UP_INSTALLED],
        'dependencies',
      );

      // update cache request (remove installed dependency)
      const response2 = await project.requestDel('prod', 'npm-gui-tests');
      t.same(response2.status, HTTP_STATUS_OK, 'status');

      // listing
      const [executionTime3, full3] = await withTimeExecution<api.Response>(
        async () => await project.requestGetFull(),
      );
      t.ok(executionTime3 < 5, 'execution time nearly instant');
      t.has(full3.body, [TEST[manager].PKG_B_UP_INSTALLED], 'dependencies');
      t.same(full3.body.length, 1, 'dependencies count');

      // update cache request (remove unknown dependency)
      const response4 = await project.requestDel('prod', 'asdfasdfasdf');
      t.same(response4.status, HTTP_STATUS_OK, 'status');
    });
  });
});
