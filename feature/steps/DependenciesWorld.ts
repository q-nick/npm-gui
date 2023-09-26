/* eslint-disable no-duplicate-imports */
/* eslint-disable unicorn/prefer-string-replace-all */
import path from 'path';

import { appRouter } from '../../server/trpc/router';
import type { Manager } from '../../server/types/dependency.types';

export const encodePath = (b64Encoded: string): string => {
  return Buffer.from(b64Encoded).toString('base64');
};

export class DependenciesProjectWorld {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public results: any[] = [];

  public testId = '';

  public managerName = '';

  private caller = appRouter.createCaller({});

  public get projectDir() {
    return path
      .join(__dirname, 'test-project-dirs', this.testId)
      .toLowerCase()
      .replace(/ /g, '-');
  }

  public async installDependencies(forceManager?: Manager, xCacheId = '') {
    return this.caller.installDependencies({
      projectPath: this.projectDir,
      xCacheId,
      forceManager,
    });
  }

  public async removeDependencies(
    dependencies: { name: string; version?: string }[],
    type: 'dev' | 'prod',
    xCacheId = '',
  ) {
    return this.caller.removeDependencies({
      projectPath: this.projectDir,
      xCacheId,
      type,
      dependencies,
    });
  }

  public async addDependencies(
    dependencies: { name: string; version?: string }[],
    type: 'dev' | 'prod',
    xCacheId = '',
  ) {
    return this.caller.addDependencies({
      projectPath: this.projectDir,
      xCacheId,
      type,
      dependencies,
    });
  }

  public async search(query: string) {
    return this.caller.search(query);
  }

  public async explorer(query: string) {
    return this.caller.explorer(query);
  }

  public async managers() {
    return this.caller.availableManagers();
  }

  public async info() {
    return this.caller.info('anyId');
  }

  public async getFastDependencies(xCacheId = '') {
    return this.caller.getAllDependenciesSimple({
      projectPath: this.projectDir,
      xCacheId,
    });
  }

  public async getFullDependencies(xCacheId = '') {
    return this.caller.getAllDependencies({
      projectPath: this.projectDir,
      xCacheId,
    });
  }

  public async saveCallResult(someCall: Promise<unknown>) {
    let result: unknown = undefined;

    await someCall
      .then((value) => (result = value))
      .catch((error) => (result = error));

    this.results.push(result);
  }
}
