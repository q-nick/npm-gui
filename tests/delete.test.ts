import { test } from 'tap';

import { HTTP_STATUS_OK } from '../server/utils/utils';
import {
  del,
  getFull,
  getSimple,
  nextManager,
  prepareTestProject,
  TEST,
} from './tests-utils';

nextManager((manager) => {
  test(`${manager} delete dependency`, async (group) => {
    await group.test('uninstalled invalid name', async (t) => {
      await prepareTestProject(manager, { 'npm-gui-tests': '^1.0.0' });

      const response = await del('prod', 'sdmvladbf3');
      t.same(response.status, HTTP_STATUS_OK, 'status');

      const fastResponse = await getSimple();

      t.has(fastResponse.body, [TEST[manager].PKG], 'dependencies');
    });

    await group.test('uninstalled valid name', async (t) => {
      await prepareTestProject(manager, { 'npm-gui-tests': '^1.0.0' });

      const response = await del('prod', 'npm-gui-tests');
      t.same(response.status, HTTP_STATUS_OK, 'status');

      const fastResponse = await getSimple();
      const fullResponse = await getFull();

      t.has(fastResponse.body, [], 'empty fast dependencies');
      t.has(fullResponse.body, [], 'empty full dependencies');
    });

    await group.test('installed valid name', async (t) => {
      await prepareTestProject(
        manager,
        { 'npm-gui-tests': '^1.0.0' },
        undefined,
        true,
      );
      const fastResponseBefore = await getSimple();
      const fullResponseBefore = await getFull();

      t.has(fastResponseBefore.body, [TEST[manager].PKG], 'fast dependencies');
      t.has(
        fullResponseBefore.body,
        [TEST[manager].PKG_INSTALLED],
        'full dependencies',
      );

      const response = await del('prod', 'npm-gui-tests');
      t.same(response.status, HTTP_STATUS_OK, 'status');

      const fastResponse = await getSimple();
      const fullResponse = await getFull();

      t.has(fastResponse.body, [], 'empty fast dependencies');
      t.has(fullResponse.body, [], 'empty full dependencies');
    });
  });
});
