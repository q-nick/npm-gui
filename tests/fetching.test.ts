/* eslint-disable max-lines */
import { executeCommandSimple } from '../server/actions/execute-command';
import type { Manager } from '../server/types/dependency.types';
import type { TestProject } from './tests-utils';
import { prepareTestProject } from './tests-utils';

const npmTestCase = {
  manager: 'npm' as Manager,
  uninstalledFast: [
    {
      manager: 'npm',
      name: 'npm-gui-tests',
      required: '^1.0.0',
      type: 'prod',
    },
  ],
  uninstalledFull: [
    {
      installed: null,
      latest: null,
      manager: 'npm',
      name: 'npm-gui-tests',
      required: '^1.0.0',
      type: 'prod',
      wanted: null,
    },
  ],
  installedFast: [
    {
      manager: 'npm',
      name: 'npm-gui-tests',
      required: '^1.0.0',
      type: 'prod',
    },
  ],
  installedFull: [
    {
      installed: '1.1.1',
      latest: '2.1.1',
      manager: 'npm',
      name: 'npm-gui-tests',
      required: '^1.0.0',
      type: 'prod',
      wanted: null,
    },
  ],
  extraneousFast: [
    {
      manager: 'npm',
      name: 'npm-gui-tests',
      required: '^1.0.0',
      type: 'prod',
    },
  ],
  extraneousFull: [
    {
      installed: '1.1.1',
      latest: '2.1.1',
      manager: 'npm',
      name: 'npm-gui-tests',
      required: '^1.0.0',
      type: 'prod',
      wanted: null,
    },
    {
      installed: '1.0.1',
      latest: null,
      manager: 'npm',
      name: 'npm-gui-tests-2',
      type: 'extraneous',
      wanted: null,
    },
  ],
  extraUninstalledFast: [
    { manager: 'npm', name: 'npm-gui-tests', required: '^1.0.0', type: 'prod' },
    {
      manager: 'npm',
      name: 'npm-gui-tests-2',
      required: '^1.0.0',
      type: 'prod',
    },
  ],
  extraUninstalledFull: [
    {
      installed: '1.1.1',
      latest: '2.1.1',
      manager: 'npm',
      name: 'npm-gui-tests',
      required: '^1.0.0',
      type: 'prod',
      wanted: null,
    },
    {
      installed: null,
      latest: null,
      manager: 'npm',
      name: 'npm-gui-tests-2',
      required: '^1.0.0',
      type: 'prod',
      wanted: null,
    },
  ],
};

const testCases = [
  npmTestCase,
  {
    manager: 'yarn' as Manager,
    uninstalledFast: npmTestCase.uninstalledFast.map((dep) => ({
      ...dep,
      manager: 'yarn',
    })),
    uninstalledFull: npmTestCase.uninstalledFull.map((dep) => ({
      ...dep,
      manager: 'yarn',
    })),
    installedFast: npmTestCase.installedFast.map((dep) => ({
      ...dep,
      manager: 'yarn',
    })),
    installedFull: npmTestCase.installedFull.map((dep) => ({
      ...dep,
      manager: 'yarn',
    })),
    extraneousFast: npmTestCase.extraneousFast.map((dep) => ({
      ...dep,
      manager: 'yarn',
    })),
    extraneousFull: [
      {
        installed: '1.1.1',
        latest: '2.1.1',
        manager: 'yarn',
        name: 'npm-gui-tests',
        required: '^1.0.0',
        type: 'prod',
        wanted: null,
      },
    ],
    extraUninstalledFast: npmTestCase.extraUninstalledFast.map((dep) => ({
      ...dep,
      manager: 'yarn',
    })),
    // TODO this should be extraneous
    extraUninstalledFull: [
      {
        installed: null,
        latest: null,
        manager: 'yarn',
        name: 'npm-gui-tests',
        required: '^1.0.0',
        type: 'prod',
        wanted: null,
      },
      {
        installed: null,
        latest: null,
        manager: 'yarn',
        name: 'npm-gui-tests-2',
        required: '^1.0.0',
        type: 'prod',
        wanted: null,
      },
    ],
  },
  {
    manager: 'pnpm' as Manager,
    uninstalledFast: npmTestCase.uninstalledFast.map((dep) => ({
      ...dep,
      manager: 'pnpm',
    })),
    uninstalledFull: npmTestCase.uninstalledFull.map((dep) => ({
      ...dep,
      manager: 'pnpm',
    })),
    installedFast: npmTestCase.installedFast.map((dep) => ({
      ...dep,
      manager: 'pnpm',
    })),
    installedFull: npmTestCase.installedFull.map((dep) => ({
      ...dep,
      manager: 'pnpm',
    })),
    extraneousFast: npmTestCase.extraneousFast.map((dep) => ({
      ...dep,
      manager: 'pnpm',
    })),
    extraneousFull: npmTestCase.extraneousFull.map((dep) => ({
      ...dep,
      manager: 'pnpm',
    })),
    extraUninstalledFast: npmTestCase.extraUninstalledFast.map((dep) => ({
      ...dep,
      manager: 'pnpm',
    })),
    extraUninstalledFull: npmTestCase.extraUninstalledFull.map((dep) => ({
      ...dep,
      manager: 'pnpm',
    })),
  },
];

describe.each(testCases)(
  '$manager fetching',
  ({
    manager,
    uninstalledFast,
    uninstalledFull,
    installedFast,
    installedFull,
    extraneousFast,
    extraneousFull,
    extraUninstalledFast,
    extraUninstalledFull,
  }) => {
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

      expect(fastResponse.body).toIncludeSameMembers(uninstalledFast);
      expect(fullResponse.body).toIncludeSameMembers(uninstalledFull);
    });

    test('installed', async () => {
      await project.prepareClear({
        dependencies: { 'npm-gui-tests': '^1.0.0' },
        install: true,
      });

      const fastResponse = await project.requestGetFast();
      const fullResponse = await project.requestGetFull();

      expect(fastResponse.body).toIncludeSameMembers(installedFast);
      expect(fullResponse.body).toIncludeSameMembers(installedFull);
    });

    test('extraneous', async () => {
      await project.prepareClear({
        dependencies: {
          'npm-gui-tests': '^1.0.0',
          'npm-gui-tests-2': '^1.0.0',
        },
        overrideDepedendencies: { 'npm-gui-tests': '^1.0.0' },
        install: true,
      });

      const fastResponse = await project.requestGetFast();
      const fullResponse = await project.requestGetFull();

      expect(fastResponse.body).toIncludeSameMembers(extraneousFast);

      // npm v7 doesnt show extraneous, v6 and v8 looks good
      // also yarn doesnt show any info about extraneous packages
      if (manager === 'npm') {
        const npmVersion = await executeCommandSimple(__dirname, 'npm -v');
        const npmVersionMajor = /^(?<major>\d+)/.exec(npmVersion);
        if (npmVersionMajor?.groups?.['major'] === '7') {
          expect(fullResponse.body).toIncludeSameMembers(
            extraneousFull.filter((d) => d.name === 'npm-gui-tests'),
          );
        } else {
          expect(fullResponse.body).toIncludeSameMembers(extraneousFull);
        }
      } else {
        expect(fullResponse.body).toIncludeSameMembers(extraneousFull);
      }
    });

    test('extra uninstalled', async () => {
      await project.prepareClear({
        dependencies: { 'npm-gui-tests': '^1.0.0' },
        overrideDepedendencies: {
          'npm-gui-tests': '^1.0.0',
          'npm-gui-tests-2': '^1.0.0',
        },
        install: true,
      });

      const fastResponse = await project.requestGetFast();
      const fullResponse = await project.requestGetFull();

      expect(fastResponse.body).toIncludeSameMembers(extraUninstalledFast);
      expect(fullResponse.body).toIncludeSameMembers(extraUninstalledFull);
    });
  },
);
