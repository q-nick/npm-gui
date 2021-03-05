import api from 'supertest';
import * as fs from 'fs';
import rimraf from 'rimraf';
import { app } from '../server';
import PACKAGE_JSON from './test-package.json';
import { executeCommandSimple } from '../server/actions/executeCommand';
import { clearCache } from '../server/utils/cache';

export function encodePath(b64Encoded: string): string {
  return Buffer.from(b64Encoded).toString('base64');
}

export async function prepareTestProject(
  dependencies?: Record<string, string>,
  devDependencies?: Record<string, string>,
  installRepo?: 'npm' | 'yarn',
): Promise<void> {
  rimraf.sync(`${__dirname}/test-project/node_modules`);
  rimraf.sync(`${__dirname}/test-project/package.json`);
  rimraf.sync(`${__dirname}/test-project/package-lock.json`);
  rimraf.sync(`${__dirname}/test-project/yarn-lock.json`);

  const packageJsonToWrite = {
    ...PACKAGE_JSON,
    ...{ dependencies },
    ...{ devDependencies },
  };

  fs.writeFileSync(`${__dirname}/test-project/package.json`, JSON.stringify(packageJsonToWrite, null, 2));
  if (installRepo === 'npm') {
    await executeCommandSimple(`${__dirname}/test-project/`, 'npm install');
  }
  if (installRepo === 'yarn') {
    await executeCommandSimple(`${__dirname}/test-project/`, 'yarn install');
  }
  clearCache(`${__dirname}/test-project`);
}

export async function getSimple(): Promise<api.Test> {
  return api(app)
    .get(`/api/project/${encodePath(`${__dirname}/test-project`)}/dependencies/simple`);
}

export async function getFull(): Promise<api.Test> {
  return api(app)
    .get(`/api/project/${encodePath(`${__dirname}/test-project`)}/dependencies/full`);
}

export async function install(): Promise<api.Test> {
  return api(app)
    .post(`/api/project/${encodePath(`${__dirname}/test-project`)}/dependencies/install`);
}

export async function installForce(): Promise<api.Test> {
  return api(app)
    .post(`/api/project/${encodePath(`${__dirname}/test-project`)}/dependencies/install/force`);
}

export async function add(type: 'dev'| 'prod', dependencies: { name: string; version: string }[]): Promise<api.Test> {
  return api(app)
    .post(`/api/project/${encodePath(`${__dirname}/test-project`)}/dependencies/${type}`)
    .send(dependencies);
}

export async function del(type: 'dev'| 'prod', name: string): Promise<api.Test> {
  return api(app)
    .delete(`/api/project/${encodePath(`${__dirname}/test-project`)}/dependencies/${type}/${name}`);
}

export const TEST_PKG = {
  name: 'npm-gui-tests',
  repo: 'npm',
  required: '^1.0.0',
  type: 'prod',
};

export const TEST_PKG_UNINSTALLED = {
  ...TEST_PKG,
  installed: null,
  wanted: null,
  latest: null,
};

export const TEST_PKG_INSTALLED = {
  ...TEST_PKG,
  installed: '1.1.1',
  wanted: null,
  latest: '2.1.1',
};

export const TEST_PKG2 = {
  name: 'npm-gui-tests',
  repo: 'npm',
  required: '^1.1.1',
  type: 'prod',
};

export const TEST_PKG2_INSTALLED = {
  ...TEST_PKG2,
  installed: '1.1.1',
  wanted: null,
  latest: '2.1.1',
};
