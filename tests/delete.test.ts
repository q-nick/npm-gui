import { HTTP_STATUS_OK } from '../server/utils/utils';
import type { TestProject } from './tests-utils';
import { managers, prepareTestProject, TEST } from './tests-utils';

describe.each(managers)('%s install', (manager) => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let project: TestProject;

  beforeAll(async () => {
    project = await prepareTestProject('delete', manager);
  });

  test('uninstalled invalid name', async () => {
    await project.prepareClear({
      dependencies: { 'npm-gui-tests': '^1.0.0' },
    });

    const response = await project.requestDel('prod', 'sdmvladbf3');
    expect(response.status).toBe(HTTP_STATUS_OK);

    const fastResponse = await project.requestGetFast();

    expect(fastResponse.body).toPartiallyContain(TEST[manager].PKG_A);
  });

  test('uninstalled valid name', async () => {
    await project.prepareClear({
      dependencies: { 'npm-gui-tests': '^1.0.0' },
    });

    const response = await project.requestDel('prod', 'npm-gui-tests');
    expect(response.status).toBe(HTTP_STATUS_OK);

    const fastResponse = await project.requestGetFast();
    const fullResponse = await project.requestGetFull();

    expect(fastResponse.body).toEqual([]);
    expect(fullResponse.body).toEqual([]);
  });

  test('installed valid name', async () => {
    await project.prepareClear({
      dependencies: { 'npm-gui-tests': '^1.0.0' },
      install: true,
    });
    const fastResponseBefore = await project.requestGetFast();
    const fullResponseBefore = await project.requestGetFull();

    expect(fastResponseBefore.body).toPartiallyContain(TEST[manager].PKG_A);
    expect(fullResponseBefore.body).toPartiallyContain(
      TEST[manager].PKG_A_INSTALLED,
    );

    const response = await project.requestDel('prod', 'npm-gui-tests');
    expect(response.status).toBe(HTTP_STATUS_OK);

    const fastResponse = await project.requestGetFast();
    const fullResponse = await project.requestGetFull();

    expect(fastResponse.body).toEqual([]);
    expect(fullResponse.body).toEqual([]);
  });
});
