import { test } from 'tap';

import {
  getFull,
  getSimple,
  nextManager,
  prepareTestProject,
  TEST,
} from './tests-utils';

nextManager(async (manager) => {
  await test(`${manager} fetching`, async (group) => {
    await group.test('nothing', async (t) => {
      await prepareTestProject(manager);

      const fastResponse = await getSimple();
      const fullResponse = await getFull();

      t.has(fastResponse.body, [], 'empty fast dependencies');
      t.has(fullResponse.body, [], 'empty full dependencies');
    });

    await group.test('uninstalled', async (t) => {
      await prepareTestProject(manager, { 'npm-gui-tests': '^1.0.0' });

      const fastResponse = await getSimple();
      const fullResponse = await getFull();

      t.has(fastResponse.body, [TEST[manager].PKG], 'fast dependencies');
      t.has(
        fullResponse.body,
        [TEST[manager].PKG_UNINSTALLED],
        'full dependencies',
      );
    });

    await group.test('installed', async (t) => {
      await prepareTestProject(
        manager,
        { 'npm-gui-tests': '^1.0.0' },
        undefined,
        true,
      );

      const fastResponse = await getSimple();
      const fullResponse = await getFull();

      t.has(fastResponse.body, [TEST[manager].PKG], 'fast dependencies');
      t.has(
        fullResponse.body,
        [TEST[manager].PKG_INSTALLED],
        'full dependencies',
      );
    });
  });
});
