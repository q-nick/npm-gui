import { test } from 'tap';

import { HTTP_STATUS_OK } from '../server/utils/utils';
import {
  nextDependenciesType,
  nextManager,
  prepareTestProject,
  TEST,
} from './tests-utils';

nextDependenciesType(async (dependencyType) => {
  nextManager(async (manager) => {
    const project = await prepareTestProject('add-single');

    await test(`${manager} add single ${dependencyType} dependency`, async (group) => {
      await group.test('invalid name', async (t) => {
        await project.prepareClear({ manager });

        const response = await project.requestAdd(dependencyType, [
          { name: 'sdmvladbf3', version: 'v1.0.0' },
        ]);
        t.notSame(response.status, HTTP_STATUS_OK, 'status');

        const fastResponse = await project.requestGetFast();
        const fullResponse = await project.requestGetFull();

        t.has(fastResponse.body, [], 'empty dependencies');
        t.has(fullResponse.body, [], 'empty dependencies');
      });

      await group.test('invalid version', async (t) => {
        await project.prepareClear({ manager });

        const response = await project.requestAdd(dependencyType, [
          { name: 'npm-gui-tests', version: 'v3.0.0' },
        ]);
        t.notSame(response.status, HTTP_STATUS_OK, 'status');

        const fastResponse = await project.requestGetFast();
        const fullResponse = await project.requestGetFull();

        t.has(fastResponse.body, [], 'empty dependencies');
        t.has(fullResponse.body, [], 'empty dependencies');
      });

      await group.test('correct dependency, no version', async (t) => {
        await project.prepareClear({ manager });

        const response = await project.requestAdd(dependencyType, [
          { name: 'npm-gui-tests' },
        ]);
        t.same(response.status, HTTP_STATUS_OK, 'status');

        const fastResponse = await project.requestGetFast();
        const fullResponse = await project.requestGetFull();

        t.has(
          fastResponse.body,
          [
            {
              ...TEST[manager].PKG_A,
              required: '^2.1.1',
              type: dependencyType,
            },
          ],
          'fast dependencies',
        );
        t.has(
          fullResponse.body,
          [{ ...TEST[manager].PKG_A_UP_NEWEST, type: dependencyType }],
          'full dependencies',
        );
      });

      await group.test('correct dependency, with version', async (t) => {
        await project.prepareClear({ manager });

        const response = await project.requestAdd(dependencyType, [
          { name: 'npm-gui-tests', version: '^1.0.0' },
        ]);
        t.same(response.status, HTTP_STATUS_OK, 'status');

        const fastResponse = await project.requestGetFast();
        const fullResponse = await project.requestGetFull();

        t.has(
          fastResponse.body,
          [{ ...TEST[manager].PKG_A_UP, type: dependencyType }],
          'fast dependencies',
        );
        t.has(
          fullResponse.body,
          [{ ...TEST[manager].PKG_A_UP_INSTALLED, type: dependencyType }],
          'full dependencies',
        );
      });
    });
  });
});
