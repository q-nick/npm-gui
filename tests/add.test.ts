import { test } from 'tap';

import { HTTP_STATUS_OK } from '../server/utils/utils';
import {
  add,
  getFull,
  getSimple,
  nextManager,
  prepareTestProject,
  TEST,
} from './tests-utils';

nextManager(async (manager) => {
  await test(`${manager} add dependency`, async (group) => {
    await group.test('invalid name', async (t) => {
      await prepareTestProject(manager);

      const response = await add('prod', [
        { name: 'sdmvladbf3', version: 'v1.0.0' },
      ]);
      t.notSame(response.status, HTTP_STATUS_OK, 'status');

      const fastResponse = await getSimple();
      const fullResponse = await getFull();

      t.has(fastResponse.body, [], 'empty dependencies');
      t.has(fullResponse.body, [], 'empty dependencies');
    });

    await group.test('invalid version', async (t) => {
      await prepareTestProject(manager);

      const response = await add('prod', [
        { name: 'npm-gui-tests', version: 'v3.0.0' },
      ]);
      t.notSame(response.status, HTTP_STATUS_OK, 'status');

      const fastResponse = await getSimple();
      const fullResponse = await getFull();

      t.has(fastResponse.body, [], 'empty dependencies');
      t.has(fullResponse.body, [], 'empty dependencies');
    });

    await group.test('correct dependency, no version', async (t) => {
      await prepareTestProject(manager);

      const response = await add('prod', [{ name: 'npm-gui-tests' }]);
      t.same(response.status, HTTP_STATUS_OK, 'status');

      const fastResponse = await getSimple();
      const fullResponse = await getFull();

      t.has(
        fastResponse.body,
        [{ ...TEST[manager].PKG2, required: '^2.1.1' }],
        'fast dependencies',
      );
      t.has(
        fullResponse.body,
        [TEST[manager].PKG2_NEWEST],
        'full dependencies',
      );
    });

    await group.test('correct dependency, with version', async (t) => {
      await prepareTestProject(manager);

      const response = await add('prod', [
        { name: 'npm-gui-tests', version: '^1.0.0' },
      ]);
      t.same(response.status, HTTP_STATUS_OK, 'status');

      const fastResponse = await getSimple();
      const fullResponse = await getFull();

      t.has(fastResponse.body, [TEST[manager].PKG2], 'fast dependencies');
      t.has(
        fullResponse.body,
        [TEST[manager].PKG2_INSTALLED],
        'full dependencies',
      );
    });
  });
});
