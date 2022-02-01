import { test } from 'tap';

import {
  getFull,
  getSimple,
  install,
  nextManager,
  prepareTestProject,
  TEST,
} from './tests-utils';

nextManager((manager) => {
  test(`${manager} install`, async (group) => {
    await group.test('nothing', async (t) => {
      await prepareTestProject(manager);

      await install();

      const fastResponse = await getSimple();
      const fullResponse = await getFull();

      t.has(fastResponse.body, [], 'empty dependencies');
      t.has(fullResponse.body, [], 'empty dependencies');
    });

    await group.test('uninstalled', async (t) => {
      await prepareTestProject(manager, { 'npm-gui-tests': '^1.0.0' });

      await install();

      const fastResponse = await getSimple();
      const fullResponse = await getFull();

      t.has(fastResponse.body, [TEST[manager].PKG], 'fast dependencies');
      t.has(
        fullResponse.body,
        [TEST[manager].PKG_INSTALLED],
        'full dependencies',
      );
    });

    await group.test('uninstalled', async (t) => {
      await prepareTestProject(
        manager,
        { 'npm-gui-tests': '^1.0.0' },
        undefined,
        true,
      );

      await install();

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
