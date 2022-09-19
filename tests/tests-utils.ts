/* eslint-disable max-lines */
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
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  extraneous?: Record<string, string>;
  install?: true;
  emptyProject?: true;
}

export interface TestProject {
  requestGetFast: (xCacheId?: string) => Promise<api.Test>;
  requestGetFull: (xCacheId?: string) => Promise<api.Test>;
  requestInstall: (xCacheId?: string) => Promise<api.Test>;
  requestInstallForce: (
    manager: string,
    xCacheId?: string,
  ) => Promise<api.Test>;
  requestAdd: (
    type: 'dev' | 'prod',
    dependencies: { name: string; version?: string }[],
    xCacheId?: string,
  ) => Promise<api.Test>;
  requestDel: (
    type: 'dev' | 'prod',
    name: string,
    xCacheId?: string,
  ) => Promise<api.Test>;

  prepareClear: (p: Parameters) => Promise<void>;
}

export const prepareTestProject = async (
  directoryId: string,
  manager: Manager,
): Promise<TestProject> => {
  const testDirectoryPath = path.join(
    __dirname,
    `test-project-${manager}`,
    directoryId || 'undefined',
  );

  await ensureDir(testDirectoryPath);

  const encodedTestDirectoryPath = encodePath(testDirectoryPath);

  return {
    prepareClear: async ({
      dependencies,
      devDependencies,
      install,
      extraneous,
      emptyProject,
    }: Parameters): ReturnType<TestProject['prepareClear']> => {
      clearCache(manager + testDirectoryPath);

      await remove(path.join(testDirectoryPath, 'node_modules'));
      await remove(path.join(testDirectoryPath, 'package.json'));
      await remove(path.join(testDirectoryPath, 'package-lock.json'));
      await remove(path.join(testDirectoryPath, 'yarn.lock'));
      await remove(path.join(testDirectoryPath, 'pnpm-lock.yaml'));
      await remove(path.join(testDirectoryPath, 'yarn-error.lock'));

      if (emptyProject) {
        return;
      }

      const packageJsonToWrite = {
        ...PACKAGE_JSON,
        dependencies,
        devDependencies,
      };

      await writeJson(
        path.join(testDirectoryPath, 'package.json'),
        packageJsonToWrite,
      );
      await writeFile(path.join(testDirectoryPath, 'somefile'), '');

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

      // override dependencies with etraneous to emulate them
      if (extraneous) {
        await writeJson(path.join(testDirectoryPath, 'package.json'), {
          ...packageJsonToWrite,
          dependencies: extraneous,
        });
      }

      clearCache(manager + testDirectoryPath);
    },

    requestInstall: async (
      xCacheId = '',
    ): ReturnType<TestProject['requestInstall']> => {
      return api(app.server)
        .post(`/api/project/${encodedTestDirectoryPath}/dependencies/install`)
        .set({ 'x-cache-id': xCacheId });
    },

    requestInstallForce: async (
      forceManager: string,
      xCacheId = '',
    ): ReturnType<TestProject['requestInstallForce']> => {
      return api(app.server)
        .post(
          `/api/project/${encodedTestDirectoryPath}/dependencies/install/${forceManager}`,
        )
        .set({ 'x-cache-id': xCacheId });
    },

    requestGetFast: async (
      xCacheId = '',
    ): ReturnType<TestProject['requestGetFast']> => {
      return api(app.server)
        .get(`/api/project/${encodedTestDirectoryPath}/dependencies/simple`)
        .set({ 'x-cache-id': xCacheId });
    },

    requestGetFull: async (
      xCacheId = '',
    ): ReturnType<TestProject['requestGetFull']> => {
      return api(app.server)
        .get(`/api/project/${encodedTestDirectoryPath}/dependencies/full`)
        .set({ 'x-cache-id': xCacheId });
    },

    requestAdd: async (
      type,
      dependencies,
      xCacheId = '',
    ): ReturnType<TestProject['requestAdd']> => {
      return api(app.server)
        .post(`/api/project/${encodedTestDirectoryPath}/dependencies/${type}`)
        .set({ 'x-cache-id': xCacheId })
        .send(dependencies);
    },

    requestDel: async (
      type,
      name,
      xCacheId = '',
    ): ReturnType<TestProject['requestDel']> => {
      return api(app.server)
        .delete(
          `/api/project/${encodedTestDirectoryPath}/dependencies/${type}/${name}`,
        )
        .set({ 'x-cache-id': xCacheId });
    },
  };
};

export const managers: Manager[] = ['npm', 'pnpm', 'yarn'];
export const dependencyTypes: ('dev' | 'prod')[] = ['prod', 'dev'];

export const PKG_A = {
  name: 'npm-gui-tests',
  required: '^1.0.0',
  manager: 'npm',
  type: 'prod',
};

export const PKG_B = {
  name: 'npm-gui-tests-2',
  required: '^1.0.0',
  manager: 'npm',
  type: 'prod',
};

export const NPM = {
  PKG_A,
  PKG_B,
  PKG_A_UNINSTALLED: {
    ...PKG_A,
    installed: null,
    wanted: null,
    latest: null,
  },
  PKG_A_INSTALLED: {
    ...PKG_A,
    installed: '1.1.1',
    wanted: null,
    latest: '2.1.1',
  },
  PKG_A_UP: {
    ...PKG_A,
    required: '^1.1.1',
  },
  PKG_B_UP: {
    ...PKG_B,
    required: '^1.0.1',
  },
  PKG_A_UP_INSTALLED: {
    ...PKG_A,
    required: '^1.1.1',
    installed: '1.1.1',
    wanted: null,
    latest: '2.1.1',
  },
  PKG_B_UP_INSTALLED: {
    ...PKG_B,
    required: '^1.0.1',
    installed: '1.0.1',
    wanted: null,
    latest: null,
  },
  PKG_A_UP_NEWEST: {
    ...PKG_A,
    required: '^2.1.1',
    installed: '2.1.1',
    wanted: null,
    latest: null,
  },
  PKG_B_UP_NEWEST: {
    ...PKG_B,
    required: '^1.0.1',
    installed: '1.0.1',
    wanted: null,
    latest: null,
  },
};

export const YARN = {
  PKG_A: { ...NPM.PKG_A, manager: 'yarn' },
  PKG_B: { ...NPM.PKG_B, manager: 'yarn' },
  PKG_A_UNINSTALLED: { ...NPM.PKG_A_UNINSTALLED, manager: 'yarn' },
  PKG_A_INSTALLED: { ...NPM.PKG_A_INSTALLED, manager: 'yarn' },
  PKG_A_UP: { ...NPM.PKG_A_UP, required: '^1.0.0', manager: 'yarn' },
  PKG_B_UP: { ...NPM.PKG_B_UP, required: '^1.0.0', manager: 'yarn' },
  PKG_A_UP_INSTALLED: {
    ...NPM.PKG_A_UP_INSTALLED,
    required: '^1.0.0',
    manager: 'yarn',
  },
  PKG_B_UP_INSTALLED: {
    ...NPM.PKG_B_UP_INSTALLED,
    required: '^1.0.0',
    manager: 'yarn',
  },
  PKG_A_UP_NEWEST: { ...NPM.PKG_A_UP_NEWEST, manager: 'yarn' },
  PKG_B_UP_NEWEST: { ...NPM.PKG_B_UP_NEWEST, manager: 'yarn' },
};

export const PNPM = {
  PKG_A: { ...NPM.PKG_A, manager: 'pnpm' },
  PKG_B: { ...NPM.PKG_B, manager: 'pnpm' },
  PKG_A_UNINSTALLED: { ...NPM.PKG_A_UNINSTALLED, manager: 'pnpm' },
  PKG_A_INSTALLED: { ...NPM.PKG_A_INSTALLED, manager: 'pnpm' },
  PKG_A_UP: { ...YARN.PKG_A_UP, manager: 'pnpm' },
  PKG_B_UP: { ...YARN.PKG_B_UP, manager: 'pnpm' },
  PKG_A_UP_INSTALLED: {
    ...YARN.PKG_A_UP_INSTALLED,
    manager: 'pnpm',
  },
  PKG_B_UP_INSTALLED: {
    ...YARN.PKG_B_UP_INSTALLED,
    manager: 'pnpm',
  },
  PKG_A_UP_NEWEST: { ...NPM.PKG_A_UP_NEWEST, manager: 'pnpm' },
  PKG_B_UP_NEWEST: { ...NPM.PKG_B_UP_NEWEST, manager: 'pnpm' },
};

export const TEST = {
  npm: NPM,
  pnpm: PNPM,
  yarn: YARN,
};
