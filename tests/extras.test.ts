import type { TestProject } from './tests-utils';
import { managers, prepareTestProject } from './tests-utils';

describe.each(managers)('%s extra info', (manager) => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let project: TestProject;

  beforeAll(async () => {
    project = await prepareTestProject('extras', manager);
  });

  test('get', async () => {
    await project.prepareClear({
      dependencies: { 'npm-gui-tests': '^1.0.0' },
    });

    await project.requestInstall();

    const extrasResponse = await project.requestGetExtras(
      manager,
      'npm-gui-tests@2.0.0',
    );

    expect(extrasResponse.body).toMatchObject({
      size: 1606,
      homepage: 'https://github.com/q-nick/npm-gui-tests#readme',
      repository: 'git+https://github.com/q-nick/npm-gui-tests.git',
      time: {
        '1.0.0': '2018-11-01T10:54:29.979Z',
        '1.0.1': '2018-11-01T10:56:06.435Z',
        '1.1.0': '2018-11-01T10:56:22.241Z',
        '1.1.1': '2018-11-01T10:56:37.871Z',
        '2.0.0': '2018-11-01T10:57:00.397Z',
        '2.0.1': '2018-11-01T10:57:11.030Z',
        '2.1.0': '2018-11-01T10:58:01.883Z',
        '2.1.1': '2018-11-01T11:07:19.996Z',
        created: '2018-11-01T10:54:29.810Z',
        modified: '2022-05-11T12:35:33.226Z',
      },
      created: '2018-11-01T10:54:29.810Z',
      updated: '2022-05-11T12:35:33.226Z',
      versions: [
        '1.0.0',
        '1.0.1',
        '1.1.0',
        '1.1.1',
        '2.0.0',
        '2.0.1',
        '2.1.0',
        '2.1.1',
      ],
    });
  });
});
