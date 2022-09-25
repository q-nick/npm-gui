import { executeCommand } from '../server/actions/execute-command';
import {
  getDependenciesFromPackageJson,
  getDevelopmentDependenciesFromPackageJson,
  getRequiredFromPackageJson,
  getTypeFromPackageJson,
} from '../server/utils/get-project-package-json';

describe(`get package.json exceptions`, () => {
  test('getDependenciesFromPackageJson', () => {
    expect(getDependenciesFromPackageJson('anything')).toEqual({});
  });

  test('getDevDependenciesFromPackageJson', () => {
    expect(getDevelopmentDependenciesFromPackageJson('anything')).toEqual({});
  });

  test('getTypeFromPackageJson', () => {
    expect(getTypeFromPackageJson('anything', 'anything')).toBe('extraneous');

    expect(getTypeFromPackageJson('./', 'anything')).toBe('extraneous');
  });

  test('getRequiredFromPackageJson', () => {
    expect(getRequiredFromPackageJson('anything', 'anything')).toBe(undefined);

    expect(getRequiredFromPackageJson('./', 'anything')).toBe(undefined);
  });

  describe(`execute command exceptions`, () => {
    test('empty string', async () => {
      await expect(executeCommand('', '')).rejects.toThrowError();
    });
  });
});
