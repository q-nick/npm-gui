import { test } from 'tap';

import { nextManager, prepareTestProject, TEST } from './tests-utils';

nextManager(async (manager) => {
  const project = await prepareTestProject('fetching');
  await test(`${manager} fetching`, async (group) => {
    await group.test('nothing', async (t) => {
      await project.prepareClear({ manager });

      const fastResponse = await project.requestGetFast();
      const fullResponse = await project.requestGetFull();

      t.has(fastResponse.body, [], 'empty fast dependencies');
      t.has(fullResponse.body, [], 'empty full dependencies');
    });

    await group.test('uninstalled', async (t) => {
      await project.prepareClear({
        manager,
        dependencies: { 'npm-gui-tests': '^1.0.0' },
      });

      const fastResponse = await project.requestGetFast();
      const fullResponse = await project.requestGetFull();

      t.has(fastResponse.body, [TEST[manager].PKG_A], 'fast dependencies');
      t.has(
        fullResponse.body,
        [TEST[manager].PKG_A_UNINSTALLED],
        'full dependencies',
      );
    });

    await group.test('installed', async (t) => {
      await project.prepareClear({
        manager,
        dependencies: { 'npm-gui-tests': '^1.0.0' },
        install: true,
      });

      const fastResponse = await project.requestGetFast();
      const fullResponse = await project.requestGetFull();

      t.has(fastResponse.body, [TEST[manager].PKG_A], 'fast dependencies');
      t.has(
        fullResponse.body,
        [TEST[manager].PKG_A_INSTALLED],
        'full dependencies',
      );
    });

    if (manager !== 'yarn') {
      await group.test('extraneous', async (t) => {
        await project.prepareClear({
          manager,
          dependencies: {
            'npm-gui-tests': '^1.0.0',
            'npm-gui-tests-2': '^1.0.0',
          },
          extraneous: { 'npm-gui-tests': '^1.0.0' },
          install: true,
        });

        const fastResponse = await project.requestGetFast();
        const fullResponse = await project.requestGetFull();

        t.same(fastResponse.body.length, 1, 'fast dependencies count');
        t.has(fastResponse.body, [TEST[manager].PKG_A], 'fast dependencies');

        t.same(fullResponse.body.length, 2, 'full dependencies count');
        t.has(
          fullResponse.body,
          [
            TEST[manager].PKG_A_INSTALLED,
            {
              name: 'npm-gui-tests-2',
              type: 'extraneous',
            },
          ],
          'full dependencies',
        );
      });
    }
  });
});
