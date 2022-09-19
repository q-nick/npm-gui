import { HTTP_STATUS_OK } from '../server/utils/utils';
import type { TestProject } from './tests-utils';
import {
  dependencyTypes,
  managers,
  prepareTestProject,
  TEST,
} from './tests-utils';

describe.each(dependencyTypes)('add single %s depednency', (dependencyType) => {
  describe.each(managers)('as %s', (manager) => {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let project: TestProject;

    beforeAll(async () => {
      project = await prepareTestProject('add-single', manager);
    });

    test('invalid name', async () => {
      await project.prepareClear({});

      const response = await project.requestAdd(dependencyType, [
        { name: 'sdmvladbf3', version: 'v1.0.0' },
      ]);
      expect(response.status).not.toBe(HTTP_STATUS_OK);

      const fastResponse = await project.requestGetFast();
      const fullResponse = await project.requestGetFull();

      expect(fastResponse.body).toEqual([]);
      expect(fullResponse.body).toEqual([]);
    });

    test('invalid version', async () => {
      await project.prepareClear({});

      const response = await project.requestAdd(dependencyType, [
        { name: 'npm-gui-tests', version: 'v3.0.0' },
      ]);
      expect(response.status).not.toBe(HTTP_STATUS_OK);

      const fastResponse = await project.requestGetFast();
      const fullResponse = await project.requestGetFull();

      expect(fastResponse.body).toEqual([]);
      expect(fullResponse.body).toEqual([]);
    });

    test('correct dependency, no version', async () => {
      await project.prepareClear({});

      const response = await project.requestAdd(dependencyType, [
        { name: 'npm-gui-tests' },
      ]);
      expect(response.status).toBe(HTTP_STATUS_OK);

      const fastResponse = await project.requestGetFast();
      const fullResponse = await project.requestGetFull();

      expect(fastResponse.body).toPartiallyContain({
        ...TEST[manager].PKG_A,
        required: '^2.1.1',
        type: dependencyType,
      });
      expect(fullResponse.body).toPartiallyContain({
        ...TEST[manager].PKG_A_UP_NEWEST,
        type: dependencyType,
      });
    });

    test('correct dependency, with version', async () => {
      await project.prepareClear({});

      const response = await project.requestAdd(dependencyType, [
        { name: 'npm-gui-tests', version: '^1.0.0' },
      ]);
      expect(response.status).toBe(HTTP_STATUS_OK);

      const fastResponse = await project.requestGetFast();
      const fullResponse = await project.requestGetFull();

      expect(fastResponse.body).toPartiallyContain({
        ...TEST[manager].PKG_A_UP,
        type: dependencyType,
      });
      expect(fullResponse.body).toPartiallyContain({
        ...TEST[manager].PKG_A_UP_INSTALLED,
        type: dependencyType,
      });
    });
  });
});
