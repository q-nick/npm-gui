import { test } from 'tap';

import { executeCommand } from '../server/actions/execute-command';
import {
  getDependenciesFromPackageJson,
  getDevelopmentDependenciesFromPackageJson,
  getRequiredFromPackageJson,
  getTypeFromPackageJson,
} from '../server/utils/get-project-package-json';

test(`get package.json exceptions`, async (group) => {
  await group.test('getDependenciesFromPackageJson', async (t) => {
    t.same(getDependenciesFromPackageJson('anything'), {}, 'should return {}');
  });

  await group.test('getDevDependenciesFromPackageJson', async (t) => {
    t.same(
      getDevelopmentDependenciesFromPackageJson('anything'),
      {},
      'should return {}',
    );
  });

  await group.test('getTypeFromPackageJson', async (t) => {
    t.same(
      getTypeFromPackageJson('anything', 'anything'),
      'extraneous',
      'should return extraneous',
    );

    t.same(
      getTypeFromPackageJson('./', 'anything'),
      'extraneous',
      'should return extraneous',
    );
  });

  await group.test('getRequiredFromPackageJson', async (t) => {
    t.same(
      getRequiredFromPackageJson('anything', 'anything'),
      undefined,
      'should return undefined',
    );

    t.same(
      getRequiredFromPackageJson('./', 'anything'),
      undefined,
      'should return undefined',
    );
  });
});

test(`execute command exceptions`, async (group) => {
  await group.test('empty string', async (t) => {
    try {
      await executeCommand('', '');
      // should not be called
      t.same(1, 2);
    } catch (error) {
      t.ok(error);
    }
  });
});
