import { test } from 'tap';

import { nextManager, prepareTestProject, TEST } from './tests-utils';

nextManager(async (manager) => {
  const project = await prepareTestProject('install');

  await test(`${manager} install`, async (group) => {
    await group.test('nothing', async (t) => {
      await project.prepareClear({ manager });

      await project.requestInstall();

      const fastResponse = await project.requestGetFast();
      const fullResponse = await project.requestGetFull();

      t.has(fastResponse.body, [], 'empty dependencies');
      t.has(fullResponse.body, [], 'empty dependencies');
    });

    await group.test('uninstalled', async (t) => {
      await project.prepareClear({
        manager,
        dependencies: { 'npm-gui-tests': '^1.0.0' },
      });

      await project.requestInstall();

      const fastResponse = await project.requestGetFast();
      const fullResponse = await project.requestGetFull();

      t.has(fastResponse.body, [TEST[manager].PKG], 'fast dependencies');
      t.has(
        fullResponse.body,
        [TEST[manager].PKG_INSTALLED],
        'full dependencies',
      );
    });

    await group.test('uninstalled', async (t) => {
      await project.prepareClear({
        manager,
        dependencies: { 'npm-gui-tests': '^1.0.0' },
        install: true,
      });

      await project.requestInstall();

      const fastResponse = await project.requestGetFast();
      const fullResponse = await project.requestGetFull();

      t.has(fastResponse.body, [TEST[manager].PKG], 'fast dependencies');
      t.has(
        fullResponse.body,
        [TEST[manager].PKG_INSTALLED],
        'full dependencies',
      );
    });
  });
});
