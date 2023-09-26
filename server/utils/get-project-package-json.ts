import { existsSync, readFileSync } from 'fs';
import path from 'path';

import type { DependencyBase, Manager } from '../types/dependency.types';
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

export const getDevelopmentDependenciesFromPackageJson = (
  projectPath: string,
): Record<string, string> => {
  const packageJson = getProjectPackageJSON(projectPath);
  if (packageJson === null || !('devDependencies' in packageJson)) {
    return {};
  }
  return packageJson.devDependencies ?? {};
};

export const getAllDependenciesFromPackageJson = (
  projectPath: string,
): Record<string, string> => {
  return {
    ...getDependenciesFromPackageJson(projectPath),
    ...getDevelopmentDependenciesFromPackageJson(projectPath),
  };
};

export const getAllDependenciesFromPackageJsonAsArray = (
  projectPath: string,
  manager: Manager,
): DependencyBase[] => {
  const dependencies = getDependenciesFromPackageJson(projectPath);
  const devDependencies =
    getDevelopmentDependenciesFromPackageJson(projectPath);
  return [
    ...Object.entries(dependencies).map(
      ([name, required]): DependencyBase => ({
        manager,
        name,
        type: 'prod',
        required,
      }),
    ),
    ...Object.entries(devDependencies).map(
      ([name, required]): DependencyBase => ({
        manager,
        name,
        type: 'dev',
        required,
      }),
    ),
  ];
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
