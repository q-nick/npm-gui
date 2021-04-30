import api from 'supertest';
import * as fs from 'fs';
import * as path from 'path';
import rimraf from 'rimraf';
import { app } from '../server';
import PACKAGE_JSON from './test-package.json';
import { executeCommandSimple } from '../server/actions/executeCommand';
import { clearCache } from '../server/utils/cache';
import type { Manager } from '../server/types/Dependency';

export function encodePath(b64Encoded: string): string {
  return Buffer.from(b64Encoded).toString('base64');
}

export async function prepareTestProject(
  manager: Manager,
  dependencies?: Record<string, string>,
  devDependencies?: Record<string, string>,
  doInstall = false,
): Promise<void> {
  rimraf.sync(path.join(__dirname, 'test-project', 'node_modules'));
  rimraf.sync(path.join(__dirname, 'test-project', 'package.json'));
  rimraf.sync(path.join(__dirname, 'test-project', 'package-lock.json'));
  rimraf.sync(path.join(__dirname, 'test-project', 'yarn.lock'));
  rimraf.sync(path.join(__dirname, 'test-project', 'pnpm-lock.yaml'));
  rimraf.sync(path.join(__dirname, 'test-project', 'yarn-error.lock'));

  const packageJsonToWrite = {
    ...PACKAGE_JSON,
    ...{ dependencies },
    ...{ devDependencies },
  };

  fs.writeFileSync(path.join(__dirname, 'test-project', 'package.json'), JSON.stringify(packageJsonToWrite, null, 2)); // eslint-disable-line

  if (manager === 'yarn') {
    fs.writeFileSync(path.join(__dirname, 'test-project', 'yarn.lock'), '');
  }
  if (manager === 'pnpm') {
    fs.writeFileSync(path.join(__dirname, 'test-project', 'pnpm-lock.yaml'), '');
  }

  if (manager === 'npm' && doInstall) {
    await executeCommandSimple(path.join(__dirname, 'test-project'), 'npm install');
  }
  if (manager === 'yarn' && doInstall) {
    await executeCommandSimple(path.join(__dirname, 'test-project'), 'yarn install');
  }
  if (manager === 'pnpm' && doInstall) {
    await executeCommandSimple(path.join(__dirname, 'test-project'), 'pnpm install');
  }
  clearCache();
}

export async function getSimple(): Promise<api.Test> {
  return api(app.server)
    .get(`/api/project/${encodePath(path.join(__dirname, 'test-project'))}/dependencies/simple`);
}

export async function getFull(): Promise<api.Test> {
  return api(app.server)
    .get(`/api/project/${encodePath(path.join(__dirname, 'test-project'))}/dependencies/full`);
}

export async function install(): Promise<api.Test> {
  return api(app.server)
    .post(`/api/project/${encodePath(path.join(__dirname, 'test-project'))}/dependencies/install`);
}

export async function installForce(): Promise<api.Test> {
  return api(app.server)
    .post(`/api/project/${encodePath(path.join(__dirname, 'test-project'))}/dependencies/install/force`);
}

export async function add(type: 'dev'| 'prod', dependencies: { name: string; version?: string }[]): Promise<api.Test> {
  return api(app.server)
    .post(`/api/project/${encodePath(path.join(__dirname, 'test-project'))}/dependencies/${type}`)
    .send(dependencies);
}

export async function del(type: 'dev'| 'prod', name: string): Promise<api.Test> {
  return api(app.server)
    .delete(`/api/project/${encodePath(path.join(__dirname, 'test-project'))}/dependencies/${type}/${name}`);
}

export function nextManager(cb: (manager: Manager) => void): void {
  cb('npm');
  cb('yarn');
  cb('pnpm');
}

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
  PKG2_INSTALLED: { ...NPM.PKG2_INSTALLED, required: '^1.0.0', manager: 'yarn' },
  PKG2_NEWEST: { ...NPM.PKG2_NEWEST, manager: 'yarn' },
};

export const PNPM = {
  PKG: { ...NPM.PKG, manager: 'pnpm' },
  PKG_UNINSTALLED: { ...NPM.PKG_UNINSTALLED, manager: 'pnpm' },
  PKG_INSTALLED: { ...NPM.PKG_INSTALLED, manager: 'pnpm' },
  PKG2: { ...NPM.PKG2, required: '^1.0.0', manager: 'pnpm' },
  PKG2_INSTALLED: { ...NPM.PKG2_INSTALLED, required: '^1.0.0', manager: 'pnpm' },
  PKG2_NEWEST: { ...NPM.PKG2_NEWEST, manager: 'pnpm' },
};

export const TEST = {
  npm: NPM,
  pnpm: PNPM,
  yarn: YARN,
};
