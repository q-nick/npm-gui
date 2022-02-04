import { test } from 'tap';

import { HTTP_STATUS_OK } from '../server/utils/utils';
import { nextManager, prepareTestProject, TEST } from './tests-utils';

nextManager(async (manager) => {
  await test(`${manager} delete dependency`, async (group) => {
    const project = await prepareTestProject('delete');

    await group.test('uninstalled invalid name', async (t) => {
      await project.prepareClear({
        manager,
        dependencies: { 'npm-gui-tests': '^1.0.0' },
      });

      const response = await project.requestDel('prod', 'sdmvladbf3');
      t.same(response.status, HTTP_STATUS_OK, 'status');

      const fastResponse = await project.requestGetFast();

      t.has(fastResponse.body, [TEST[manager].PKG_A], 'dependencies');
    });

    await group.test('uninstalled valid name', async (t) => {
      await project.prepareClear({
        manager,
        dependencies: { 'npm-gui-tests': '^1.0.0' },
      });

      const response = await project.requestDel('prod', 'npm-gui-tests');
      t.same(response.status, HTTP_STATUS_OK, 'status');

      const fastResponse = await project.requestGetFast();
      const fullResponse = await project.requestGetFull();

      t.has(fastResponse.body, [], 'empty fast dependencies');
      t.has(fullResponse.body, [], 'empty full dependencies');
    });

    await group.test('installed valid name', async (t) => {
      await project.prepareClear({
        manager,
        dependencies: { 'npm-gui-tests': '^1.0.0' },
        install: true,
      });
      const fastResponseBefore = await project.requestGetFast();
      const fullResponseBefore = await project.requestGetFull();

      t.has(
        fastResponseBefore.body,
        [TEST[manager].PKG_A],
        'fast dependencies',
      );
      t.has(
        fullResponseBefore.body,
        [TEST[manager].PKG_A_INSTALLED],
        'full dependencies',
      );

      const response = await project.requestDel('prod', 'npm-gui-tests');
      t.same(response.status, HTTP_STATUS_OK, 'status');

      const fastResponse = await project.requestGetFast();
      const fullResponse = await project.requestGetFull();

      t.has(fastResponse.body, [], 'empty fast dependencies');
      t.has(fullResponse.body, [], 'empty full dependencies');
    });
  });
});
