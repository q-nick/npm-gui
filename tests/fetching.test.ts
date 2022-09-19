import type { TestProject } from './tests-utils';
import { managers, prepareTestProject, TEST } from './tests-utils';

describe.each(managers)('%s fetching', (manager) => {
  if (manager.includes('pnpm')) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/init-declarations
  let project: TestProject;

  beforeAll(async () => {
    project = await prepareTestProject('fetching', manager);
  });

  test('no package.json', async () => {
    await project.prepareClear({ emptyProject: true });

    const fastResponse = await project.requestGetFast();
    const fullResponse = await project.requestGetFull();

    // TODO this is weird
    expect(fastResponse.body).toEqual({});
    expect(fullResponse.body).toEqual({});
  });

  test('no dependencies', async () => {
    await project.prepareClear({});

    const fastResponse = await project.requestGetFast();
    const fullResponse = await project.requestGetFull();

    expect(fastResponse.body).toEqual([]);
    expect(fullResponse.body).toEqual([]);
  });

  test('uninstalled', async () => {
    await project.prepareClear({
      dependencies: { 'npm-gui-tests': '^1.0.0' },
    });

    const fastResponse = await project.requestGetFast();
    const fullResponse = await project.requestGetFull();

    expect(fastResponse.body).toIncludeAllMembers([TEST[manager].PKG_A]);
    expect(fullResponse.body).toIncludeAllMembers([
      TEST[manager].PKG_A_UNINSTALLED,
    ]);
  });

  test('installed', async () => {
    await project.prepareClear({
      dependencies: { 'npm-gui-tests': '^1.0.0' },
      install: true,
    });

    const fastResponse = await project.requestGetFast();
    const fullResponse = await project.requestGetFull();

    expect(fastResponse.body).toIncludeAllMembers([TEST[manager].PKG_A]);
    expect(fullResponse.body).toIncludeAllMembers([
      TEST[manager].PKG_A_INSTALLED,
    ]);
  });

  if (manager.includes('yarn')) {
    return;
  }

  test.skip('extraneous', async () => {
    await project.prepareClear({
      dependencies: {
        'npm-gui-tests': '^1.0.0',
        'npm-gui-tests-2': '^1.0.0',
      },
      extraneous: { 'npm-gui-tests': '^1.0.0' },
      install: true,
    });

    const fastResponse = await project.requestGetFast();
    const fullResponse = await project.requestGetFull();

    expect(fastResponse.body).toHaveLength(1);
    expect(fastResponse.body).toIncludeAllMembers([TEST[manager].PKG_A]);

    expect(fullResponse.body).toHaveLength(2);
    expect(fullResponse.body).toIncludeAllMembers([
      TEST[manager].PKG_A_INSTALLED,
      {
        name: 'npm-gui-tests-2',
        type: 'extraneous',
      },
    ]);
  });
});
