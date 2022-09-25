import type { TestProject } from './tests-utils';
import { managers, prepareTestProject } from './tests-utils';

describe.each(managers)('%s comparators', (manager) => {
  describe.each([
    { required: '*', installed: '2.1.1', latest: null, wanted: null },
    { required: '1', installed: '1.1.1', latest: '2.1.1', wanted: null },
    { required: '1.*', installed: '1.1.1', latest: '2.1.1', wanted: null },
    { required: '1.0.0', installed: '1.0.0', latest: '2.1.1', wanted: null },
    {
      required: 'v1.0.0',
      installed: '1.0.0',
      latest: '2.1.1',
      wanted: null,
    },
    {
      required: '=1.0.0',
      installed: '1.0.0',
      latest: '2.1.1',
      wanted: null,
    },
    {
      required: '^1.0.0',
      installed: '1.1.1',
      latest: '2.1.1',
      wanted: null,
    },
    { required: '>=1.0.0', installed: '2.1.1', latest: null, wanted: null },
    {
      required: '~1.0.0',
      installed: '1.0.1',
      latest: '2.1.1',
      wanted: null,
    },
    {
      required: '>=1.0.0 < 2.0.0',
      installed: '1.1.1',
      latest: '2.1.1',
      wanted: null,
    },
    {
      required: '1.0.0 - 2.0.0',
      installed: '2.0.0',
      latest: '2.1.1',
      wanted: null,
    },
    // '1.0.0-beta.1',
  ])('%s', ({ required, installed, wanted, latest }) => {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let project: TestProject;

    beforeAll(async () => {
      project = await prepareTestProject('comparators', manager);
    });

    test('uninstalled', async () => {
      await project.prepareClear({
        dependencies: { 'npm-gui-tests': required },
      });

      const fastResponse = await project.requestGetFast();
      const fullResponse = await project.requestGetFull();

      expect(fastResponse.body).toIncludeAllMembers([
        {
          manager,
          name: 'npm-gui-tests',
          required,
          type: 'prod',
        },
      ]);

      expect(fullResponse.body).toIncludeAllMembers([
        {
          manager,
          name: 'npm-gui-tests',
          required,
          installed: null,
          latest: null,
          wanted: null,
          type: 'prod',
        },
      ]);
    });

    test('installed', async () => {
      await project.prepareClear({
        dependencies: { 'npm-gui-tests': required },
        install: true,
      });

      const fastResponse = await project.requestGetFast();
      const fullResponse = await project.requestGetFull();

      expect(fastResponse.body).toIncludeAllMembers([
        {
          manager,
          name: 'npm-gui-tests',
          required,
          type: 'prod',
        },
      ]);

      expect(fullResponse.body).toIncludeAllMembers([
        {
          manager,
          name: 'npm-gui-tests',
          required,
          installed,
          latest,
          wanted,
          type: 'prod',
        },
      ]);
    });
  });
});
