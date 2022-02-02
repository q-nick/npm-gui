/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-statements */
import { ensureDir, remove, writeFile, writeJson } from 'fs-extra';
import path from 'path';
import api from 'supertest';

import { app } from '../server';
import { executeCommandSimple } from '../server/actions/execute-command';
import type { Manager } from '../server/types/dependency.types';
import { clearCache } from '../server/utils/cache';
import PACKAGE_JSON from './test-package.json';

export const encodePath = (b64Encoded: string): string => {
  return Buffer.from(b64Encoded).toString('base64');
};

interface Parameters {
  manager: Manager;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  install?: true;
}

interface TestProject {
  requestGetFast: () => Promise<api.Test>;
  requestGetFull: () => Promise<api.Test>;
  requestInstall: () => Promise<api.Test>;
  requestInstallForce: (manager: string) => Promise<api.Test>;
  requestAdd: (
    type: 'dev' | 'prod',
    dependencies: { name: string; version?: string }[],
  ) => Promise<api.Test>;
  requestDel: (type: 'dev' | 'prod', name: string) => Promise<api.Test>;

  prepareClear: (p: Parameters) => Promise<void>;
}

export const prepareTestProject = async (
  directoryId: string,
): Promise<TestProject> => {
  const testDirectoryPath = path.join(
    __dirname,
    'test-project',
    directoryId || 'undefined',
  );

  await ensureDir(testDirectoryPath);

  const encodedTestDirectoryPath = encodePath(testDirectoryPath);

  return {
    prepareClear: async ({
      dependencies,
      devDependencies,
      manager,
      install,
    }: Parameters): ReturnType<TestProject['prepareClear']> => {
      await remove(path.join(testDirectoryPath, 'node_modules'));
      await remove(path.join(testDirectoryPath, 'package.json'));
      await remove(path.join(testDirectoryPath, 'package-lock.json'));
      await remove(path.join(testDirectoryPath, 'yarn.lock'));
      await remove(path.join(testDirectoryPath, 'pnpm-lock.yaml'));
      await remove(path.join(testDirectoryPath, 'yarn-error.lock'));

      const packageJsonToWrite = {
        ...PACKAGE_JSON,
        dependencies,
        devDependencies,
      };

      await writeJson(
        path.join(testDirectoryPath, 'package.json'),
        packageJsonToWrite,
      );

      if (manager === 'yarn') {
        await writeFile(path.join(testDirectoryPath, 'yarn.lock'), '');
      }
      if (manager === 'pnpm') {
        await writeFile(path.join(testDirectoryPath, 'pnpm-lock.yaml'), '');
      }

      if (install && manager === 'npm') {
        await executeCommandSimple(path.join(testDirectoryPath), 'npm install');
      }
      if (install && manager === 'yarn') {
        await executeCommandSimple(
          path.join(testDirectoryPath),
          'yarn install',
        );
      }
      if (install && manager === 'pnpm') {
        await executeCommandSimple(
          path.join(testDirectoryPath),
          'pnpm install',
        );
      }

      clearCache();
    },

    requestInstall: async (): ReturnType<TestProject['requestInstall']> => {
      return api(app.server).post(
        `/api/project/${encodedTestDirectoryPath}/dependencies/install`,
      );
    },

    requestInstallForce: async (
      manager: string,
    ): ReturnType<TestProject['requestInstallForce']> => {
      return api(app.server).post(
        `/api/project/${encodedTestDirectoryPath}/dependencies/install/${manager}`,
      );
    },

    requestGetFast: async (): ReturnType<TestProject['requestGetFast']> => {
      return api(app.server).get(
        `/api/project/${encodedTestDirectoryPath}/dependencies/simple`,
      );
    },

    requestGetFull: async (): ReturnType<TestProject['requestGetFull']> => {
      return api(app.server).get(
        `/api/project/${encodedTestDirectoryPath}/dependencies/full`,
      );
    },

    requestAdd: async (
      type: 'dev' | 'prod',
      dependencies: { name: string; version?: string }[],
    ): ReturnType<TestProject['requestAdd']> => {
      return api(app.server)
        .post(`/api/project/${encodedTestDirectoryPath}/dependencies/${type}`)
        .send(dependencies);
    },

    requestDel: async (
      type: 'dev' | 'prod',
      name: string,
    ): ReturnType<TestProject['requestDel']> => {
      return api(app.server).delete(
        `/api/project/${encodedTestDirectoryPath}/dependencies/${type}/${name}`,
      );
    },
  };
};

export const nextManager = async (
  callback: (manager: Manager) => Promise<void>,
): Promise<void> => {
  await callback('npm');
  await callback('yarn');
  await callback('pnpm');
};

export const PKG = {
  name: 'npm-gui-tests',
  required: '^1.0.0',
  manager: 'npm',
  type: 'prod',
};

export const NPM = {
  PKG,
  PKG_UNINSTALLED: {
    ...PKG,
    installed: null,
    wanted: null,
    latest: null,
  },
  PKG_INSTALLED: {
    ...PKG,
    installed: '1.1.1',
    wanted: null,
    latest: '2.1.1',
  },
  PKG2: {
    ...PKG,
    required: '^1.1.1',
  },
  PKG2_INSTALLED: {
    ...PKG,
    required: '^1.1.1',
    installed: '1.1.1',
    wanted: null,
    latest: '2.1.1',
  },
  PKG2_NEWEST: {
    ...PKG,
    required: '^2.1.1',
    installed: '2.1.1',
    wanted: null,
    latest: null,
  },
};

export const YARN = {
  PKG: { ...NPM.PKG, manager: 'yarn' },
  PKG_UNINSTALLED: { ...NPM.PKG_UNINSTALLED, manager: 'yarn' },
  PKG_INSTALLED: { ...NPM.PKG_INSTALLED, manager: 'yarn' },
  PKG2: { ...NPM.PKG2, required: '^1.0.0', manager: 'yarn' },
  PKG2_INSTALLED: {
    ...NPM.PKG2_INSTALLED,
    required: '^1.0.0',
    manager: 'yarn',
  },
  PKG2_NEWEST: { ...NPM.PKG2_NEWEST, manager: 'yarn' },
};

export const PNPM = {
  PKG: { ...NPM.PKG, manager: 'pnpm' },
  PKG_UNINSTALLED: { ...NPM.PKG_UNINSTALLED, manager: 'pnpm' },
  PKG_INSTALLED: { ...NPM.PKG_INSTALLED, manager: 'pnpm' },
  PKG2: { ...NPM.PKG2, required: '^1.0.0', manager: 'pnpm' },
  PKG2_INSTALLED: {
    ...NPM.PKG2_INSTALLED,
    required: '^1.0.0',
    manager: 'pnpm',
  },
  PKG2_NEWEST: { ...NPM.PKG2_NEWEST, manager: 'pnpm' },
};

export const TEST = {
  npm: NPM,
  pnpm: PNPM,
  yarn: YARN,
};
