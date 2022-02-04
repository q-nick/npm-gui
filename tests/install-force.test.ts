import { test } from 'tap';

import { nextManager, prepareTestProject, TEST } from './tests-utils';

nextManager(async (manager) => {
  const project = await prepareTestProject('install-force');

  await test(`${manager} force reinstall`, async (group) => {
    await group.test('nothing', async (t) => {
      await project.prepareClear({ manager });

      await project.requestInstallForce(manager);

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

      await project.requestInstallForce(manager);

      const fastResponse = await project.requestGetFast();
      const fullResponse = await project.requestGetFull();

      t.has(fastResponse.body, [TEST[manager].PKG_A], 'fast dependencies');
      t.has(
        fullResponse.body,
        [TEST[manager].PKG_A_INSTALLED],
        'full dependencies',
      );
    });

    await group.test('uninstalled', async (t) => {
      await project.prepareClear({
        manager,
        dependencies: { 'npm-gui-tests': '^1.0.0' },
      });

      await project.requestInstallForce(manager);

      const fastResponse = await project.requestGetFast();
      const fullResponse = await project.requestGetFull();

      t.has(fastResponse.body, [TEST[manager].PKG_A], 'fast dependencies');
      t.has(
        fullResponse.body,
        [TEST[manager].PKG_A_INSTALLED],
        'full dependencies',
      );
    });
  });
});
