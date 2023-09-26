import { emptyDir, readJson, writeFile, writeJson } from 'fs-extra';
import path from 'path';

import type { Manager } from '../../server/types/dependency.types';
import { clearCache } from '../../server/utils/cache';
import PACKAGE_JSON from '../../tests/test-package.json';
import { DependenciesProjectWorld } from './DependenciesWorld';

export class TestWorld extends DependenciesProjectWorld {
  public async prepareProjectDir() {
    // create clear test dir
    await emptyDir(this.projectDir);

    // clear npm-gui internal cache
    clearCache(this.projectDir);
  }

  public async addToPackageJson(values: object) {
    const packageJsonPath = path.join(this.projectDir, 'package.json');

    const packageJson = await readJson(packageJsonPath);

    await writeJson(packageJsonPath, { ...packageJson, ...values });
  }

  public async initProject(
    manager: Manager,
    dependencies?: Record<string, string>,
  ) {
    const packageJsonPath = path.join(this.projectDir, 'package.json');

    const packageJsonToWrite = {
      ...PACKAGE_JSON,
      dependencies,
    };

    // create package-json
    await writeJson(packageJsonPath, packageJsonToWrite);

    // create some empty file
    await writeFile(path.join(this.projectDir, 'somefile'), '');

    if (manager === 'yarn') {
      await writeFile(path.join(this.projectDir, 'yarn.lock'), '');
    }
    if (manager === 'pnpm') {
      await writeFile(path.join(this.projectDir, 'pnpm-lock.yaml'), '');
    }
  }
}
