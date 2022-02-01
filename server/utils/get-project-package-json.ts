import { existsSync, readFileSync } from 'fs';
import path from 'path';

import { parseJSON } from './parse-json';

interface PackageJSON {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export const getProjectPackageJSON = (
  projectPath: string,
): PackageJSON | null => {
  const packageJSONpath = path.join(projectPath, 'package.json');
  if (existsSync(packageJSONpath)) {
    return parseJSON<PackageJSON>(
      readFileSync(packageJSONpath, { encoding: 'utf8' }),
    );
  }

  return null;
};

export const getDependenciesFromPackageJson = (
  projectPath: string,
): Record<string, string> => {
  const packageJson = getProjectPackageJSON(projectPath);
  if (packageJson === null || !('dependencies' in packageJson)) {
    return {};
  }
  return packageJson.dependencies ?? {};
};

export const getDevDependenciesFromPackageJson = (
  projectPath: string,
): Record<string, string> => {
  const packageJson = getProjectPackageJSON(projectPath);
  if (packageJson === null || !('devDependencies' in packageJson)) {
    return {};
  }
  return packageJson.devDependencies ?? {};
};

export const getTypeFromPackageJson = (
  projectPath: string,
  dependencyName: string,
): 'dev' | 'extraneous' | 'prod' => {
  const packageJson = getProjectPackageJSON(projectPath);
  if (packageJson === null) {
    console.log('ERROR????');
    return 'extraneous';
  }

  const { dependencies, devDependencies } = packageJson;

  if (dependencies && dependencyName in dependencies) {
    return 'prod';
  }

  if (devDependencies && dependencyName in devDependencies) {
    return 'dev';
  }

  return 'extraneous';
};

export const getRequiredFromPackageJson = (
  projectPath: string,
  dependencyName: string,
): string | undefined => {
  const packageJson = getProjectPackageJSON(projectPath);
  if (packageJson === null) {
    return undefined;
  }

  const { dependencies, devDependencies } = packageJson;

  if (dependencies && dependencyName in dependencies) {
    return dependencies[dependencyName];
  }

  if (devDependencies && dependencyName in devDependencies) {
    return devDependencies[dependencyName];
  }

  return undefined;
};
