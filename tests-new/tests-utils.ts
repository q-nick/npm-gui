import api from 'supertest';
import * as fs from 'fs';
import * as path from 'path';
import rimraf from 'rimraf';
import { app } from '../server';
import PACKAGE_JSON from './test-package.json';
import { executeCommandSimple } from '../server/actions/executeCommand';
import { clearCache } from '../server/utils/cache';

export function encodePath(b64Encoded: string): string {
  return Buffer.from(b64Encoded).toString('base64');
}

export async function prepareTestProject(
  manager: 'npm' | 'yarn',
  dependencies?: Record<string, string>,
  devDependencies?: Record<string, string>,
  doInstall = false,
): Promise<void> {
  rimraf.sync(path.join(__dirname, 'test-project', 'node_modules'));
  rimraf.sync(path.join(__dirname, 'test-project', 'package.json'));
  rimraf.sync(path.join(__dirname, 'test-project', 'package-lock.json'));
  rimraf.sync(path.join(__dirname, 'test-project', 'yarn.lock'));
  rimraf.sync(path.join(__dirname, 'test-project', 'yarn-error.lock'));

  const packageJsonToWrite = {
    ...PACKAGE_JSON,
    ...{ dependencies },
    ...{ devDependencies },
  };

  fs.writeFileSync(path.join(__dirname, 'test-project', 'package.json'), JSON.stringify(packageJsonToWrite, null, 2));

  if (manager === 'yarn') {
    fs.writeFileSync(path.join(__dirname, 'test-project', 'yarn.lock'), '');
  }

  if (manager === 'npm' && doInstall) {
    await executeCommandSimple(path.join(__dirname, 'test-project'), 'npm install');
  }
  if (manager === 'yarn' && doInstall) {
    await executeCommandSimple(path.join(__dirname, 'test-project'), 'yarn install');
  }
  clearCache(path.join(__dirname, 'test-project'));
}

export async function getSimple(): Promise<api.Test> {
  return api(app)
    .get(`/api/project/${encodePath(path.join(__dirname, 'test-project'))}/dependencies/simple`);
}

export async function getFull(): Promise<api.Test> {
  return api(app)
    .get(`/api/project/${encodePath(path.join(__dirname, 'test-project'))}/dependencies/full`);
}

export async function install(): Promise<api.Test> {
  return api(app)
    .post(`/api/project/${encodePath(path.join(__dirname, 'test-project'))}/dependencies/install`);
}

export async function installForce(): Promise<api.Test> {
  return api(app)
    .post(`/api/project/${encodePath(path.join(__dirname, 'test-project'))}/dependencies/install/force`);
}

export async function add(type: 'dev'| 'prod', dependencies: { name: string; version: string }[]): Promise<api.Test> {
  return api(app)
    .post(`/api/project/${encodePath(path.join(__dirname, 'test-project'))}/dependencies/${type}`)
    .send(dependencies);
}

export async function del(type: 'dev'| 'prod', name: string): Promise<api.Test> {
  return api(app)
    .delete(`/api/project/${encodePath(path.join(__dirname, 'test-project'))}/dependencies/${type}/${name}`);
}

export function nextManager(cb: (manager: 'npm' | 'yarn') => void): void {
  cb('npm');
  cb('yarn');
}

export const PKG = {
  name: 'npm-gui-tests',
  required: '^1.0.0',
  repo: 'npm',
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
};

export const YARN = {
  PKG: { ...NPM.PKG, repo: 'yarn' },
  PKG_UNINSTALLED: { ...NPM.PKG_UNINSTALLED, repo: 'yarn' },
  PKG_INSTALLED: { ...NPM.PKG_INSTALLED, repo: 'yarn' },
  PKG2: { ...NPM.PKG2, required: '^1.0.0', repo: 'yarn' },
  PKG2_INSTALLED: { ...NPM.PKG2_INSTALLED, required: '^1.0.0', repo: 'yarn' },
};

export const TEST = {
  npm: NPM,
  yarn: YARN,
};
