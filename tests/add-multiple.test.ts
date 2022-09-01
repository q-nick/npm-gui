import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_OK } from '../server/utils/utils';
import type { TestProject } from './tests-utils';
import {
  dependencyTypes,
  managers,
  prepareTestProject,
  TEST,
} from './tests-utils';

describe.each(dependencyTypes)(
  'add multiple dependencies as %s',
  (dependencyType) => {
    describe.each(managers)('%s', (manager) => {
      // eslint-disable-next-line @typescript-eslint/init-declarations
      let project: TestProject;

      beforeAll(async () => {
        project = await prepareTestProject('install');
      });

      test('invalid name', async () => {
        await project.prepareClear({ manager });

        const response = await project.requestAdd(dependencyType, [
          { name: 'sdmvladbf3', version: 'v1.0.0' },
          { name: 'fasdf2', version: 'v1.0.0' },
        ]);
        expect(response.status).toBe(HTTP_STATUS_BAD_REQUEST);

        const fastResponse = await project.requestGetFast();
        const fullResponse = await project.requestGetFull();

        expect(fastResponse.body).toEqual([]);
        expect(fullResponse.body).toEqual([]);
      });

      test('invalid version', async () => {
        await project.prepareClear({ manager });

        const response = await project.requestAdd(dependencyType, [
          { name: 'npm-gui-tests', version: 'v3.0.0' },
          { name: 'npm-gui-tests-2', version: 'v15.0.0' },
        ]);
        expect(response.status).toBe(HTTP_STATUS_BAD_REQUEST);

        const fastResponse = await project.requestGetFast();
        const fullResponse = await project.requestGetFull();

        expect(fastResponse.body).toEqual([]);
        expect(fullResponse.body).toEqual([]);
      });

      test('correct dependency, no version', async () => {
        await project.prepareClear({ manager });

        const response = await project.requestAdd(dependencyType, [
          { name: 'npm-gui-tests' },
          { name: 'npm-gui-tests-2' },
        ]);
        expect(response.status).toBe(HTTP_STATUS_OK);

        const fastResponse = await project.requestGetFast();
        const fullResponse = await project.requestGetFull();

        expect(fastResponse.body).toIncludeAllMembers([
          {
            ...TEST[manager].PKG_A_UP,
            required: '^2.1.1',
            type: dependencyType,
          },
          {
            ...TEST[manager].PKG_B_UP,
            required: '^1.0.1',
            type: dependencyType,
          },
        ]);

        expect(fullResponse.body).toIncludeAllMembers([
          { ...TEST[manager].PKG_A_UP_NEWEST, type: dependencyType },
          { ...TEST[manager].PKG_B_UP_NEWEST, type: dependencyType },
        ]);
      });

      test('correct dependency, with version', async () => {
        await project.prepareClear({ manager });

        const response = await project.requestAdd(dependencyType, [
          { name: 'npm-gui-tests', version: '^1.0.0' },
          { name: 'npm-gui-tests-2', version: '^1.0.0' },
        ]);
        expect(response.status).toBe(HTTP_STATUS_OK);

        const fastResponse = await project.requestGetFast();
        const fullResponse = await project.requestGetFull();

        expect(fastResponse.body).toIncludeAllMembers([
          { ...TEST[manager].PKG_A_UP, type: dependencyType },
          { ...TEST[manager].PKG_B_UP, type: dependencyType },
        ]);
        expect(fullResponse.body).toIncludeAllMembers([
          { ...TEST[manager].PKG_A_UP_INSTALLED, type: dependencyType },
          { ...TEST[manager].PKG_B_UP_INSTALLED, type: dependencyType },
        ]);
      });
    });
  },
);
