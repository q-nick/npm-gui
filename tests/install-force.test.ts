import type { TestProject } from './tests-utils';
import { managers, prepareTestProject, TEST } from './tests-utils';

describe.each(managers)('%s install', (manager) => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let project: TestProject;

  beforeAll(async () => {
    project = await prepareTestProject('install');
  });

  test('nothing', async () => {
    await project.prepareClear({ manager });

    await project.requestInstallForce(manager);

    const fastResponse = await project.requestGetFast();
    const fullResponse = await project.requestGetFull();

    expect(fastResponse.body).toEqual([]);
    expect(fullResponse.body).toEqual([]);
  });

  test('uninstalled', async () => {
    await project.prepareClear({
      manager,
      dependencies: { 'npm-gui-tests': '^1.0.0' },
    });

    await project.requestInstallForce(manager);

    const fastResponse = await project.requestGetFast();
    const fullResponse = await project.requestGetFull();

    expect(fastResponse.body).toEqual([TEST[manager].PKG_A]);
    expect(fullResponse.body).toEqual([TEST[manager].PKG_A_INSTALLED]);
  });

  test('uninstalled', async () => {
    await project.prepareClear({
      manager,
      dependencies: { 'npm-gui-tests': '^1.0.0' },
      install: true,
    });

    await project.requestInstallForce(manager);

    const fastResponse = await project.requestGetFast();
    const fullResponse = await project.requestGetFull();

    expect(fastResponse.body).toEqual([TEST[manager].PKG_A]);
    expect(fullResponse.body).toEqual([TEST[manager].PKG_A_INSTALLED]);
  });
});
